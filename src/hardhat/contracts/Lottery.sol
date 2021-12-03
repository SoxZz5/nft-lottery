// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "./chainlink/PriceConsumers.sol";
import "./LotteryToken.sol";

struct Parameters {
    uint8 chainCurrencyDecimals;
    uint ticketPriceUsd;
    address payable fundsReleaseAddress;
    uint totalWinners;
    Token token;
    Periods periods;
    LotteryEvent[] events;
    PriceConsumer priceConsumer;
    ChainlinkVRFData vrfData;
}

struct Token {
    string name;
    string symbol;
    string CID;
}

struct Periods {
    uint beginningOfParticipationPeriod;
    uint endOfParticipationPeriod;
    uint endOfPreparationPeriod;
}

struct LotteryEvent {
    uint timestamp;
    string description;
}

struct ChainlinkVRFData {
    address coordinator;
    address link;
    bytes32 keyHash;
    uint fee;
}

struct Participant {
    address wallet;
    uint tokenId;
}

struct Range {
    uint min;
    uint max;
}

contract Lottery is VRFConsumerBase {
    enum State 
    { 
        WaitingForLINK,
        WaitingForParticipationPeriod, 
        OngoingParticipationPeriod, 
        OngoingPreparationPeriod,
        WaitingForNextEvent,
        WaitingForFundsRelease,
        Complete 
    }

    uint8 public immutable chainTokenDecimals; // Chain token decimals (ETH, MATIC, ...)
    address payable public immutable fundsReleaseAddress;
    LotteryToken public immutable token;

    // Ticket price in USD
    // Supports 2 decimals (e.g. 100 for $1, 10 for $0.1, 1 for $0.01)
    uint public immutable ticketPriceUsd;       
    uint constant ticketPriceDecimals = 2;

    // Periods
    Periods public periods;

    // Events
    LotteryEvent[] public events;
    uint private remainingEventsCount;

    // Participants
    Participant[] public participants;
    Range[] public remainingParticipantsRanges;
    uint private remainingParticipantsCount;

    // Winners
    Participant[] public winners;
    uint public totalWinners;
    uint128 private _winnersRandomness;

    // Maps TokenId with rank
    // 0 is pending or loser, 1 is 1st, ...
    mapping(uint => uint) public winnersTokenId;

    // Maps participants address and their winning state
    // False is pending or lost, True is won 
    mapping(address => bool) public winnersAddresses;

    // Chainlink Price Feed
    PriceConsumer public immutable priceConsumer;

    // Chainlink VRF
    bytes32 public immutable vrfKeyHash;
    uint public immutable vrfFee;
    bool private vrfRequestingRandomness;
    
    constructor(Parameters memory p) 
            VRFConsumerBase(p.vrfData.coordinator, p.vrfData.link)
        {
        // ####### Testing: FOR TESTING PURPOSES ONLY
        /*if(p.events.length == 0) {
            events.push(LotteryEvent({
                    timestamp: p.periods.endOfPreparationPeriod + 60,
                    description: "Event1"
                }));
            events.push(LotteryEvent({
                    timestamp: p.periods.endOfPreparationPeriod + 120,
                    description: "Event2"
                }));
            p.events = events;
        }*/
        //####### Testing

        // Validate periods
        require(p.periods.beginningOfParticipationPeriod > block.timestamp, "Invalid timestamp: beginningOfParticipationPeriod");
        require(p.periods.endOfParticipationPeriod > p.periods.beginningOfParticipationPeriod, "Invalid timestamp: endOfParticipationPeriod");
        require(p.periods.endOfPreparationPeriod > p.periods.endOfParticipationPeriod, "Invalid timestamp: endOfPreparationPeriod");

        // Validate and copy events to storage
        require(p.events.length > 0, "No events specified");
        require(p.events[0].timestamp >= p.periods.endOfPreparationPeriod, "Invalid timestamp: First event");
        for(uint i = 0; i < p.events.length; i++) {
            require(bytes(p.events[i].description).length > 0, "Event has no description");
            if(i > 0) {
                require(p.events[i].timestamp > p.events[i-1].timestamp, "Events timestamps not in ascending order");
            }
            
            // Since the following feature is not yet supported, manually copy the array to storage.
            // UnimplementedFeatureError: Copying of type struct LotteryEvent memory[] memory to storage not yet supported.
            events.push(p.events[i]);
        }

        // Validate winners
        require(p.totalWinners >= 1, "The number of winners must be equal to or greater than 1");

        // Create lottery token
        token = new LotteryToken(this, p.token.name, p.token.symbol, p.token.CID);

        chainTokenDecimals = p.chainCurrencyDecimals;
        ticketPriceUsd = p.ticketPriceUsd;
        fundsReleaseAddress = p.fundsReleaseAddress;
        periods = p.periods;
        totalWinners = p.totalWinners;
        priceConsumer = p.priceConsumer;
        remainingEventsCount = p.events.length;
        vrfKeyHash = p.vrfData.keyHash;
        vrfFee = p.vrfData.fee;
    }

    /*
        * Triggers the next lottery event
    */
    function triggerNextEvent() external {
        require(getState() == State.WaitingForNextEvent, "Not currently waiting for the next event");

        uint nextEventIndex = _getNextEventIndex();
        LotteryEvent memory nextEvent = events[nextEventIndex];
        require(block.timestamp >= nextEvent.timestamp, "Too early to trigger the next event");

        // Chainlink VRF
        require(!vrfRequestingRandomness, "Already requesting randomness");
        requestRandomness(vrfKeyHash, vrfFee);
        vrfRequestingRandomness = true;

        // Do this early here to lower the gas used in fulfillRandomness()
        if(nextEventIndex == 0) {

            // First event. Init winners and remaining participants
            if(totalWinners > participants.length) {
                // There can not be more winners than participants
                totalWinners = participants.length;
            }

            remainingParticipantsCount = participants.length;
            remainingParticipantsRanges.push(Range({
                min: 0,
                max: participants.length - 1
            }));
        }
    }

    /*
        * Callback function used by VRF Coordinator
    */
    function fulfillRandomness(bytes32 /*requestId*/, uint256 randomness) internal override {

        // Event shuffle mechanic
        _shuffle(randomness);

        vrfRequestingRandomness = false;
        remainingEventsCount--;

        if(remainingEventsCount == 0) {
            // Use the first 16 bytes of randomness to generate the winners randomness
            _winnersRandomness = uint128(bytes16(bytes32(randomness)));
        }

        // TODO: Emit event
        // uint nextEventIndex = _getNextEventIndex();
        // LotteryEvent memory nextEvent = events[nextEventIndex];
    }

    /*
        * Randomly halves remaining participants ranges
    */
    function _shuffle(uint randomness) private {

        if(remainingParticipantsCount == totalWinners) {
            // Nothing to do. The remaining participants
            // count equals the number of expected winners
            return;
        }

        remainingParticipantsCount /= 2; // 50% halving per event
        if(remainingParticipantsCount < totalWinners) {
            // Can not halve anymore. Only reducing participants count
            // to the number of expected winners
            remainingParticipantsCount = totalWinners;
        }

        Range[] memory mRanges = remainingParticipantsRanges;
        Range[] storage sRanges = remainingParticipantsRanges;
        delete(remainingParticipantsRanges);

        if(mRanges.length == 1) {
            // 1.
            uint nextIndex = randomness % (mRanges[0].max - mRanges[0].min + 1) + mRanges[0].min;

            if(nextIndex + remainingParticipantsCount - 1 <= mRanges[0].max) {
                // 1.a
                sRanges.push(Range({
                    min: nextIndex,
                    max: nextIndex + remainingParticipantsCount - 1
                }));
            } else {
                // 1.b
                sRanges.push(Range({
                    min: nextIndex,
                    max: mRanges[0].max
                }));
                sRanges.push(Range({
                    min: mRanges[0].min,
                    max: mRanges[0].min + (remainingParticipantsCount - 1) - (mRanges[0].max - nextIndex + 1)
                }));
            }
        } else {
            // 2.
            uint firstRangeIndex = randomness % 2;
            uint nextIndex = randomness % (mRanges[firstRangeIndex].max - mRanges[firstRangeIndex].min + 1) + mRanges[firstRangeIndex].min;

            if(nextIndex + remainingParticipantsCount - 1 <= mRanges[firstRangeIndex].max) {
                // 2.a
                sRanges.push(Range({
                    min: nextIndex,
                    max: nextIndex + remainingParticipantsCount - 1
                }));
            } else {
                // 2.b

                // If first range index is 0, will be 1 and vice-versa (binary inversion)
                uint secondRangeIndex = (firstRangeIndex + 1) % 2;

                uint participantsInFirstRange = mRanges[firstRangeIndex].max - nextIndex + 1;
                uint nextParticipantsInSecondRange = remainingParticipantsCount - participantsInFirstRange;
                uint currentParticipantsInSecondRange = mRanges[secondRangeIndex].max - mRanges[secondRangeIndex].min + 1;

                uint newSecondRangeMaxIndex;
                if(nextParticipantsInSecondRange > currentParticipantsInSecondRange) {
                    // The number of participants required in the second range is too high
                    // Distribute the surplus to the first range and use the entire second range
                    uint secondRangeSurplus = nextParticipantsInSecondRange - currentParticipantsInSecondRange;
                    nextIndex -= secondRangeSurplus;
                    newSecondRangeMaxIndex = mRanges[secondRangeIndex].max;
                } else {
                    // The number of participants required fits in the second range (no surplus)
                    newSecondRangeMaxIndex = mRanges[secondRangeIndex].min + nextParticipantsInSecondRange - 1;
                }

                sRanges.push(Range({
                    min: nextIndex,
                    max: mRanges[firstRangeIndex].max
                }));
                sRanges.push(Range({
                    min: mRanges[secondRangeIndex].min,
                    max: newSecondRangeMaxIndex
                }));
            }
        }
    }

    /*
        * Participate in the lottery
        * ####### Testing Args: [[0,0,0,0,0,0]]
    */
    function participate(SpaceShips.Ship memory spaceShip) external payable {
        // ####### To perform testing, COMMENT the following line
        require(getState() == State.OngoingParticipationPeriod, "Not currently accepting participants");

        uint entryPrice = getPriceToParticipate();
        require(msg.value >= entryPrice, "Not enough funds to participate. See getPriceToParticipate()");

        // Mint lottery ticket as an NFT
        uint tokenId = token.mint(msg.sender, spaceShip);

        // Register participation
        participants.push(Participant({
            wallet: msg.sender,
            tokenId: tokenId
        }));
    }

    /*
        * Releases the funds to the lottery wallet
    */
    function triggerCompletion() external {
        require(getState() == State.WaitingForFundsRelease, "Not currently waiting for funds release");

        // Release funds
        _releaseFunds();

        // Set winners
        _setWinners();

        // TODO: Emit completion event
    }

    /*
        * Randomly finds and assigns winners with their respective ranks
    */
    function _setWinners() private {
        Range[] memory ranges = remainingParticipantsRanges;
        uint winnersCount = 1;
        
        uint rangeIndex = ranges.length == 1 ? 0 : _winnersRandomness % 2;
        uint firstWinnerIndex = _winnersRandomness % (ranges[rangeIndex].max - ranges[rangeIndex].min + 1) + ranges[rangeIndex].min;
        _setWinner(participants[firstWinnerIndex], winnersCount); // 1st winner

        if(totalWinners > 1) {

            // There are more winners to pick
            uint nextWinnerIndex = firstWinnerIndex;
            do {
                winnersCount++;
                nextWinnerIndex++;
                if(nextWinnerIndex > ranges[rangeIndex].max) {
                    // End of the current range reached

                    if(ranges.length == 2) {
                        // There are two ranges, do a binary inversion 
                        // on the index to switch to the other range
                        rangeIndex = (rangeIndex + 1) % 2;
                    }

                    // One range: Restart at the beginning of the current range
                    // Two ranges: Continue at the beginning of the other range
                    nextWinnerIndex = ranges[rangeIndex].min;
                }
                _setWinner(participants[nextWinnerIndex], winnersCount); // 2nd, 3rd winners
            }
            while(winnersCount < totalWinners);
        }
    }

    /*
        * Sets a participant as a winner with its associated rank
    */
    function _setWinner(Participant memory participant, uint rank) private {

        if(winnersAddresses[participant.wallet]) {
            // Already registered as a winner
            return;
        }
        winners.push(participant);
        winnersAddresses[participant.wallet] = true;
        winnersTokenId[participant.tokenId] = rank; // 1 for 1st, 2 for 2nd etc
    }

    /*
        * Releases the funds to the lottery wallet
    */
    function _releaseFunds() private {
        fundsReleaseAddress.transfer(address(this).balance);
    }

    /*
        * Allows the funds to get released 14 days after the last event 
        * This is a last resort option in case something goes wrong
    */
    function releaseFundsLastResort() private {
        require(block.timestamp >= events[events.length - 1].timestamp + 3600 * 24 * 14,
                "Too early to release the funds");
        _releaseFunds();
    }

    /*
        * Returns the current lottery state
    */
    function getState() public view returns(State) {
        if(getLINKAmountRequired() > 0) {
            return State.WaitingForLINK;
        }

        if(block.timestamp < periods.beginningOfParticipationPeriod) {
            return State.WaitingForParticipationPeriod;
        }

        if(block.timestamp < periods.endOfParticipationPeriod) {
            return State.OngoingParticipationPeriod;
        }

        if(block.timestamp < periods.endOfPreparationPeriod) {
            return State.OngoingPreparationPeriod;
        }

        if(participants.length > 0 && remainingEventsCount > 0) {
            return State.WaitingForNextEvent;
        }

        if(address(this).balance > 0) {
            return State.WaitingForFundsRelease;
        }

        return State.Complete;
    }

    /*
        * Returns the amount of LINK required to fund the contract 
        * LINK is used for per-event VRF computation
    */
    function getLINKAmountRequired() public view returns(uint) {
        uint amountRequired = vrfFee * remainingEventsCount;
        uint currentBalance = LINK.balanceOf(address(this));

        if(currentBalance < amountRequired) {
            return amountRequired - currentBalance;
        }
        return 0;
    }

    /*
        * Returns the price required to participate to the lottery
    */
    function getPriceToParticipate() public view returns(uint) {
        int latestPrice = priceConsumer.getLatestPrice();
        if(latestPrice <= 0) {
            // In the exceptional case of a 0 or negative price returned 
            // from the oracle, set the entry price to 0
            return 0;
        }

        // Adjust the price returned from the oracle to the full token's precision
        uint latestPriceAdjusted = uint(latestPrice) * 10 ** (chainTokenDecimals - priceConsumer.decimals());

        // Calculate the token price based on the priceConsumer's token (ETH, MATIC, ...)
        uint entryPrice = 10 ** (chainTokenDecimals * 2) * ticketPriceUsd / latestPriceAdjusted / (10 ** ticketPriceDecimals);
        return entryPrice;
    }

    /*
        * Gets the index of the next event
    */
    function _getNextEventIndex() private view returns(uint) {
        return events.length - remainingEventsCount;
    }

    /*
        * Returns whether or not the lottery is completed
    */
    function isComplete() public view returns(bool) {
        return getState() == State.Complete;
    }

    /*
        * Returns whether or not the ticket is a winning ticket
    */
    function isWinningTicket(uint tokenId) public view returns(bool) {
        return winnersTokenId[tokenId] > 0;
    }

    /*
        * Returns whether or not a specific address is a winner
    */
    function isWinner(address addr) public view returns(bool) {
        return winnersAddresses[addr];
    }

    /*
        * Returns whether or not the sender is a winner
    */
    function isWinner() public view returns(bool) {
        return winnersAddresses[msg.sender];
    }
}