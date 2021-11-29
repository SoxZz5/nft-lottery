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

    uint8 public constant totalWinners = 3;

    uint8 public immutable chainTokenDecimals; // Chain token decimals (ETH, MATIC, ...)
    uint public immutable entryPriceUsd;
    address payable public immutable fundsReleaseAddress;
    LotteryToken public immutable token;

    // Periods
    uint public immutable beginningOfParticipationPeriod;
    uint public immutable endOfParticipationPeriod;
    uint public immutable endOfPreparationPeriod;

    // Events
    LotteryEvent[] public events;
    uint private remainingEventsCount;

    // Participants
    Participant[] public participants;
    Participant[] public winners;
    mapping(uint => bool) public winnersTokenId;
    Range[] public remainingParticipantsRanges;
    uint private remainingParticipantsCount;

    // Chainlink Price Feed
    PriceConsumer public immutable priceConsumer;

    // Chainlink VRF
    bytes32 public immutable vrfKeyHash;
    uint public immutable vrfFee;
    bool private vrfRequestingRandomness;
    
    constructor(uint8 _chainTokenDecimals,
                uint _entryPriceUsd, 
                string memory _tokenName,
                string memory _tokenSymbol,
                string memory _CID, 
                address payable _fundsReleaseAddress,
                uint _beginningOfParticipationPeriod,
                uint _endOfParticipationPeriod,
                uint _endOfPreparationPeriod,
                PriceConsumer _priceConsumer,
                ChainlinkVRFData memory _vrfData/*,
                LotteryEvent[] memory _events*/) 
        VRFConsumerBase(_vrfData.coordinator, 
                        _vrfData.link)
        {
        // ####### Testing: FOR TESTING PURPOSES ONLY
        //_beginningOfParticipationPeriod = block.timestamp;
        //_endOfParticipationPeriod = _beginningOfParticipationPeriod + 60;
        //_endOfPreparationPeriod = _endOfParticipationPeriod + 60;
        LotteryEvent[2] memory _events = [
            LotteryEvent({
                timestamp: _endOfPreparationPeriod + 60,
                description: "Event1"
            }),
            LotteryEvent({
                timestamp: _endOfPreparationPeriod + 120,
                description: "Event2"
            })];
        //####### Testing

        // Validate periods
        require(_beginningOfParticipationPeriod > block.timestamp, "Invalid timestamp: beginningOfParticipationPeriod");
        require(_endOfParticipationPeriod > _beginningOfParticipationPeriod, "Invalid timestamp: endOfParticipationPeriod");
        require(_endOfPreparationPeriod > _endOfParticipationPeriod, "Invalid timestamp: endOfPreparationPeriod");

        // Validate events
        require(_events.length > 0, "No events specified");
        require(_events[0].timestamp >= _endOfPreparationPeriod, "Invalid timestamp: First event");
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

        // Create lottery token
        token = new LotteryToken(this, _tokenName, _tokenSymbol, _CID);

        chainTokenDecimals = _chainTokenDecimals;
        entryPriceUsd = _entryPriceUsd;
        fundsReleaseAddress = _fundsReleaseAddress;
        beginningOfParticipationPeriod = _beginningOfParticipationPeriod;
        endOfParticipationPeriod = _endOfParticipationPeriod;
        endOfPreparationPeriod = _endOfPreparationPeriod;
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
            // First event
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
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        Range[] memory mRanges = remainingParticipantsRanges;
        Range[] storage sRanges = remainingParticipantsRanges;
        delete(remainingParticipantsRanges);

        remainingParticipantsCount /= 2; // 50% halving
        if(remainingParticipantsCount < totalWinners) {
            // Can not halve anymore. In this case, the ranges are only shuffled.
            // The result is that 1st, 2nd, 3rd place are shuffled.
            remainingParticipantsCount = totalWinners;
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

    uint public valueTest;
    function testFunc(uint256 value) external {
        valueTest = value;
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
        for(uint i = 0; i < remainingParticipantsRanges.length && winners.length < totalWinners; i++) {
            Range memory range = remainingParticipantsRanges[i];
            for(uint j = range.min; j <= range.max && winners.length < totalWinners ; j++) {
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

        if(block.timestamp < beginningOfParticipationPeriod) {
            return State.WaitingForParticipationPeriod;
        }

        if(block.timestamp < endOfParticipationPeriod) {
            return State.OngoingParticipationPeriod;
        }

        if(block.timestamp < endOfPreparationPeriod) {
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
        uint entryPrice = 10 ** (chainTokenDecimals * 2) * entryPriceUsd / latestPriceAdjusted;
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

/**
     * Network: Polygon
     -----------------
     * VRF Coordinator (mainnet): 0x3d2341ADb2D31f1c5530cDC622016af293177AE0
     * LINK (mainnet): 0xb0897686c545045aFc77CF20eC7A532E3120E0F1
     * Key Hash (mainnet): 0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da
     * Fee: 0.0001 LINK
     -----------------
     * VRF Coordinator (testnet): 0x8C7382F9D8f56b33781fE506E897a4F1e2d17255
     * LINK (testnet): 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
     * Key Hash (mainnet): 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4
     * Fee: 0.0001 LINK
     -----------------
     * From: https://docs.chain.link/docs/vrf-contracts/
*/
contract LotteryTest is Lottery {
    constructor() Lottery(18,                                                            // Current chain token decimals. MATIC/ETH = 18
                          19,                                                             // Entry price. TESTING. Should be 19
                        "Test5424243243",                                                // Token name
                        "SS1",                                                           // Token symbol
                          "bafybeidinazu3rqvapnd2qy55kpa5kj2t32xb5dq3bysrb76ccczv7rdse", // CID
                          payable(0xf585378ff2A1DeCb335b4899250b83F46DC5c019), // Charity address
                          block.timestamp + 60 * 5,  // Participation period starts 5 minutes later
                          block.timestamp + 60 * 10, // Preparation period starts 10 minutes later
                          block.timestamp + 60 * 15, // Preparation period ends 15 minutes later
                          new PriceConsumerMaticUSD(), // Chainlink Price Feed
                          ChainlinkVRFData({           // Chainlink VRF
                            coordinator: 0x8C7382F9D8f56b33781fE506E897a4F1e2d17255,
                            link: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB,
                            keyHash: 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4,
                            fee: 0.0001 * 10 ** 18
                          })) { }
}

contract LotteryParticipationInfinite is Lottery {
    constructor() Lottery(18,                                                            // Current chain token decimals. MATIC/ETH = 18
                          0,                                                             // Entry price. TESTING. Should be 19
                        "SpaceTokenName",                                                // Token name
                        "STN",                                                           // Token symbol
                          "bafybeidinazu3rqvapnd2qy55kpa5kj2t32xb5dq3bysrb76ccczv7rdse", // CID
                          payable(0xf585378ff2A1DeCb335b4899250b83F46DC5c019), // Charity address
                        block.timestamp + 1,              // Participation period starts immediatly
                          block.timestamp + 3600 * 24 * 998, // Preparation period starts 998 days later
                          block.timestamp + 3600 * 24 * 999, // Preparation period ends 999 days later
                          new PriceConsumerMaticUSD(), // Chainlink Price Feed
                          ChainlinkVRFData({           // Chainlink VRF
                            coordinator: 0x8C7382F9D8f56b33781fE506E897a4F1e2d17255,
                            link: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB,
                            keyHash: 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4,
                            fee: 0.0001 * 10 ** 18
                          })) { }
}