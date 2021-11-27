// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./LotteryToken.sol";
import "./PriceConsumers.sol";

struct LotteryEvent {
    uint timestamp;
    string description;
}

struct LotteryParticipation {
    address participant;
    uint tokenId;
}

struct ParticipantsRange {
    uint index;
    uint minIndex;
    uint maxIndex;
    uint count;
}

contract Lottery {
    enum State 
    { 
        WaitingForParticipationPeriod, 
        OngoingParticipationPeriod, 
        OngoingPreparationPeriod,
        WaitingForNextEvent,
        WaitingForFundsRelease,
        Complete 
    }

    uint8 public immutable tokenDecimals; // Chain token decimals (ETH, MATIC, ...)
    uint public immutable entryPriceUsd;
    address payable public immutable fundsReleaseAddress;
    uint public immutable beginningOfParticipationPeriod;
    uint public immutable endOfParticipationPeriod;
    uint public immutable endOfPreparationPeriod;
    LotteryToken public immutable token;
    PriceConsumer public immutable priceConsumer;
    LotteryEvent[] public events;
    uint public remainingEventsCount;
    LotteryParticipation[] public participants;
    ParticipantsRange private participantsRange;
    
    constructor(uint8 _tokenDecimals,
                uint _entryPriceUsd, 
                string memory _tokenName,
                string memory _tokenSymbol,
                string memory _CID, 
                address payable _fundsReleaseAddress,
                uint _beginningOfParticipationPeriod,
                uint _endOfParticipationPeriod,
                uint _endOfPreparationPeriod,
                PriceConsumer _priceConsumer/*,
                LotteryEvent[] memory _events*/) {
        // FOR TESTING PURPOSES ONLY
        _beginningOfParticipationPeriod = block.timestamp;
        _endOfParticipationPeriod = _beginningOfParticipationPeriod + 60;
        _endOfPreparationPeriod = _endOfParticipationPeriod + 60;
        LotteryEvent[2] memory _events = [
            LotteryEvent({
                timestamp: _endOfPreparationPeriod + 60,
                description: "Event1"
            }),
            LotteryEvent({
                timestamp: _endOfPreparationPeriod + 120,
                description: "Event2"
            })];

        // Validate periods
        require(_beginningOfParticipationPeriod > block.timestamp, "Invalid timestamp: beginningOfParticipationPeriod");
        require(_endOfParticipationPeriod > _beginningOfParticipationPeriod, "Invalid timestamp: endOfParticipationPeriod");
        require(_endOfPreparationPeriod > _endOfParticipationPeriod, "Invalid timestamp: endOfPreparationPeriod");

        // Validate events
        require(_events.length == 0 || _events[0].timestamp >= _endOfPreparationPeriod, "Invalid timestamp: First event");
        for(uint i = 0; i < _events.length; i++) {
            require(bytes(_events[i].description).length > 0, "Event has no description");
            if(i > 0) {
                require(_events[i].timestamp > _events[i-1].timestamp, "Events timestamps not in ascending order");
            }
        }

        // Create lottery token
        token = new LotteryToken(this, _tokenName, _tokenSymbol, _CID);

        tokenDecimals = _tokenDecimals;
        entryPriceUsd = _entryPriceUsd;
        fundsReleaseAddress = _fundsReleaseAddress;
        beginningOfParticipationPeriod = _beginningOfParticipationPeriod;
        endOfParticipationPeriod = _endOfParticipationPeriod;
        endOfPreparationPeriod = _endOfPreparationPeriod;
        priceConsumer = _priceConsumer;
        remainingEventsCount = _events.length;

        // Since the following feature is not yet supported, manually copy the array to storage.
        // UnimplementedFeatureError: Copying of type struct LotteryEvent memory[] memory to storage not yet supported.
        for(uint i = 0; i < _events.length; i++) {
            events.push(_events[i]);
        }
    }

    /*
        * Returns the current lottery state
    */
    function getState() public view returns(State) {
        if(block.timestamp < beginningOfParticipationPeriod) {
            return State.WaitingForParticipationPeriod;
        }

        if(block.timestamp < endOfParticipationPeriod) {
            return State.OngoingParticipationPeriod;
        }

        if(block.timestamp < endOfPreparationPeriod) {
            return State.OngoingPreparationPeriod;
        }

        if(remainingEventsCount > 0) {
            return State.WaitingForNextEvent;
        }

        if(address(this).balance > 0) {
            return State.WaitingForFundsRelease;
        }

        return State.Complete;
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
        uint latestPriceAdjusted = uint(latestPrice) * 10 ** (tokenDecimals - priceConsumer.decimals());

        // Calculate the token price based on the priceConsumer's token (ETH, MATIC, ...)
        uint entryPrice = 10 ** (tokenDecimals * 2) * entryPriceUsd / latestPriceAdjusted;
        return entryPrice;
    }

    /*
        * Triggers the next lottery event
    */
    function triggerNextEvent() external {
        require(block.timestamp >= endOfPreparationPeriod, "Lottery preparation is not over yet");
        require(remainingEventsCount > 0, "There are no more remaining events");
        // TODO: Check participants count 

        uint nextEventIndex = events.length - remainingEventsCount;
        LotteryEvent memory nextEvent = events[nextEventIndex];
        require(block.timestamp >= nextEvent.timestamp, "Too early to trigger the next event");

        // Delete event
        delete events[nextEventIndex];

        if(nextEventIndex == 0) {
            // First event
            participantsRange = ParticipantsRange({
                index: 0,
                minIndex: 0,
                maxIndex: participants.length - 1,
                count: participants.length
            });
        }

        _triggerRandomDraw();
    }

    /*
        * Triggers the next lottery event
    */
    function _triggerRandomDraw() private {

    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) external {
        uint nextEventIndex = events.length - remainingEventsCount;
        LotteryEvent memory nextEvent = events[nextEventIndex];

        uint prevIndex = participantsRange.index;
        uint nextIndex = prevIndex + randomness % (participantsRange.count - 1);
        if(nextIndex > participantsRange.maxIndex) {
            nextIndex = participantsRange.minIndex + nextIndex % participantsRange.maxIndex - 1;
        }
        
        /*if(nextIndex >= participants.length) {
            nextIndex %= participants.length;
        }*/

        participantsRange = ParticipantsRange({
            index: nextIndex,
            minIndex: prevIndex,
            maxIndex: prevIndex + participantsRange.count - 1,
            count: participantsRange.count / 2 // 50% halve per event
        });
    }

    // Args test: [[0,0,0,0,0,0]]
    /*
        * Participate in the lottery
    */
    function participate(SpaceShips.Ship memory spaceShip) external payable {
        // COMMENTED FOR TESTING
        //require(block.timestamp >= beginningOfParticipationPeriod && block.timestamp < endOfParticipationPeriod,
                    //"Can't participate outside of the participation period");

        uint entryPrice = getPriceToParticipate();
        require(msg.value >= entryPrice, "Not enough funds to participate. See getPriceToParticipate()");

        uint tokenId = token.mint(msg.sender, spaceShip);

        // Register participation
        participants.push(LotteryParticipation({
            participant: msg.sender,
            tokenId: tokenId
        }));
    }

    /*
        * Releases the funds to the lottery wallet
    */
    function releaseFunds() public {
        require(block.timestamp >= endOfPreparationPeriod, "Lottery preparation is not over yet");
        require(remainingEventsCount == 0, "There are still remaining events");
        require(address(this).balance > 0, "Funds have already been released");

        fundsReleaseAddress.transfer(address(this).balance);
    }

    /*
        * Returns whether or not the lottery is completed
    */
    function isComplete() public view returns(bool) {
        return getState() == State.Complete;
    }
}

//contract LotteryTest is Lottery(18, 19, "bafybeifvom64za2hjknz22q5bg472b2o4xcatmxdkgq76jfcrszjqy46nm", new PriceConsumerMaticUSD()) {
contract LotteryTest is Lottery {
    constructor() Lottery(18,
                          0, // TESTING. Should be 19
                          "Test5424243243",
                          "SS1",
                          "bafybeidinazu3rqvapnd2qy55kpa5kj2t32xb5dq3bysrb76ccczv7rdse", 
                          payable(0xf585378ff2A1DeCb335b4899250b83F46DC5c019),
                          1637784300,
                          1637787900,
                          1637791500,
                          new PriceConsumerMaticUSD()) { }
}