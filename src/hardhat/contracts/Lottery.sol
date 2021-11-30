// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "./LotteryToken.sol";
import "./PriceConsumers.sol";

struct LotteryEvent {
    uint timestamp;
    string description;
}

struct Participant {
    //address participant;
    uint tokenId;
}

struct Range {
    uint min;
    uint max;
}

struct ChainlinkVRFData {
    address coordinator;
    address link;
    bytes32 keyHash;
    uint fee;
}

struct Periods {
    uint beginningOfParticipationPeriod;
    uint endOfParticipationPeriod;
    uint endOfPreparationPeriod;
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
    Participant[] public winners;
    mapping(uint => bool) public winnersTokenId;
    Range[] public remainingParticipantsRanges;
    uint public maxWinners;
    uint private remainingParticipantsCount;

    // Chainlink Price Feed
    PriceConsumer public immutable priceConsumer;

    // Chainlink VRF
    bytes32 public immutable vrfKeyHash;
    uint public immutable vrfFee;
    bool private vrfRequestingRandomness;
    
    constructor(uint8 _chainTokenDecimals,
                uint _ticketPriceUsd, 
                string memory _tokenName,
                string memory _tokenSymbol,
                string memory _CID, 
                address payable _fundsReleaseAddress,
                Periods memory _periods,
                uint _maxWinners,
                PriceConsumer _priceConsumer,
                ChainlinkVRFData memory _vrfData/*,
                LotteryEvent[] memory _events*/) 
        VRFConsumerBase(_vrfData.coordinator, 
                        _vrfData.link)
        {
        // ####### Testing: FOR TESTING PURPOSES ONLY
        LotteryEvent[2] memory _events = [
            LotteryEvent({
                timestamp: _periods.endOfPreparationPeriod + 60,
                description: "Event1"
            }),
            LotteryEvent({
                timestamp: _periods.endOfPreparationPeriod + 120,
                description: "Event2"
            })];
        //####### Testing

        // Validate periods
        require(_periods.beginningOfParticipationPeriod > block.timestamp, "Invalid timestamp: beginningOfParticipationPeriod");
        require(_periods.endOfParticipationPeriod > _periods.beginningOfParticipationPeriod, "Invalid timestamp: endOfParticipationPeriod");
        require(_periods.endOfPreparationPeriod > _periods.endOfParticipationPeriod, "Invalid timestamp: endOfPreparationPeriod");

        // Validate events
        require(_events.length > 0, "No events specified");
        require(_events[0].timestamp >= _periods.endOfPreparationPeriod, "Invalid timestamp: First event");
        for(uint i = 0; i < _events.length; i++) {
            require(bytes(_events[i].description).length > 0, "Event has no description");
            if(i > 0) {
                require(_events[i].timestamp > _events[i-1].timestamp, "Events timestamps not in ascending order");
            }
        }

        // Since the following feature is not yet supported, manually copy the array to storage.
        // UnimplementedFeatureError: Copying of type struct LotteryEvent memory[] memory to storage not yet supported.
        for(uint i = 0; i < _events.length; i++) {
            events.push(_events[i]);
        }

        // Validate winners
        require(_maxWinners >= 1, "The number of winners must be equal to or greater than 1");

        // Create lottery token
        token = new LotteryToken(this, _tokenName, _tokenSymbol, _CID);

        chainTokenDecimals = _chainTokenDecimals;
        ticketPriceUsd = _ticketPriceUsd;
        fundsReleaseAddress = _fundsReleaseAddress;
        periods = _periods;
        maxWinners = _maxWinners;
        priceConsumer = _priceConsumer;
        remainingEventsCount = _events.length;
        vrfKeyHash = _vrfData.keyHash;
        vrfFee = _vrfData.fee;
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

            if(maxWinners > participants.length) {
                // There can not be more winners than participants
                maxWinners = participants.length;
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
        * V2: Will be splitted into fulfillRandomness() & shuffle() 
    */
    function fulfillRandomness(bytes32 /*requestId*/, uint256 randomness) internal override {
        Range[] memory mRanges = remainingParticipantsRanges;
        Range[] storage sRanges = remainingParticipantsRanges;
        delete(remainingParticipantsRanges);

        remainingParticipantsCount /= 2; // 50% halving
        if(remainingParticipantsCount < maxWinners) {
            // Can not halve anymore. In this case, the ranges are only shuffled.
            // The result is that 1st, 2nd, 3rd place are shuffled.
            remainingParticipantsCount = maxWinners;
        }

        if(mRanges.length == 1) {
            uint nextIndex = randomness % (mRanges[0].max - mRanges[0].min + 1) + mRanges[0].min;

            if(nextIndex + remainingParticipantsCount - 1 <= mRanges[0].max) {
                sRanges.push(Range({
                    min: nextIndex,
                    max: nextIndex + remainingParticipantsCount - 1
                }));
            } else {
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
            uint firstRangeIndex = randomness % 2;
            uint nextIndex = randomness % (mRanges[firstRangeIndex].max - mRanges[firstRangeIndex].min + 1) + mRanges[firstRangeIndex].min;

            if(nextIndex + remainingParticipantsCount - 1 <= mRanges[firstRangeIndex].max) {
                sRanges.push(Range({
                    min: nextIndex,
                    max: nextIndex + remainingParticipantsCount - 1
                }));
            } else {
                // If first is 0 will be 1 and vice-versa
                uint secondRangeIndex = (firstRangeIndex + 1) % 2;

                uint participantsInFirstRange = mRanges[firstRangeIndex].max - nextIndex + 1;
                uint participantsInSecondRange = remainingParticipantsCount - participantsInFirstRange;
                uint secondRangeMaxIndex = mRanges[secondRangeIndex].min + participantsInSecondRange - 1;
                if(secondRangeMaxIndex >= participants.length) {
                    uint surplus = secondRangeMaxIndex + 1 - participants.length;
                    nextIndex -= surplus;
                }

                sRanges.push(Range({
                    min: nextIndex,
                    max: mRanges[firstRangeIndex].max
                }));
                sRanges.push(Range({
                    min: mRanges[secondRangeIndex].min,
                    max: mRanges[secondRangeIndex].min + (remainingParticipantsCount - 1) - (mRanges[firstRangeIndex].max - nextIndex + 1)
                }));
            }
        }

        vrfRequestingRandomness = false;
        remainingEventsCount--;

        // TODO: Emit event
        // uint nextEventIndex = _getNextEventIndex();
        // LotteryEvent memory nextEvent = events[nextEventIndex];

        if(remainingEventsCount == 0) {
            triggerCompletion();
        }
    }

    /*
        * Participate in the lottery
        * ####### Testing Args: [[0,0,0,0,0,0]]
    */
    function participate(SpaceShips.Ship memory spaceShip) external payable {
        // ####### Testing: COMMENT the following line
        require(getState() == State.OngoingParticipationPeriod, "Not currently accepting participants");
        // ####### Testing

        uint entryPrice = getPriceToParticipate();
        require(msg.value >= entryPrice, "Not enough funds to participate. See getPriceToParticipate()");

        // Mint lottery ticket as an NFT
        uint tokenId = token.mint(msg.sender, spaceShip);

        // Register participation
        participants.push(Participant({
            //participant: msg.sender,
            tokenId: tokenId
        }));
    }

    /*
        * Releases the funds to the lottery wallet
    */
    function triggerCompletion() public {
        require(getState() == State.WaitingForFundsRelease, "Not currently waiting for funds release");

        // Release funds
        _releaseFunds();

        // Fill winners
        for(uint i = 0; i < remainingParticipantsRanges.length && winners.length < maxWinners; i++) {
            Range memory range = remainingParticipantsRanges[i];
            for(uint j = range.min; j <= range.max && winners.length < maxWinners ; j++) {
                Participant memory winner = participants[j];
                winners.push(winner);
                winnersTokenId[winner.tokenId] = true;
            }
        }

        // TODO: Emit completion event
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
        return winnersTokenId[tokenId];
    }
}