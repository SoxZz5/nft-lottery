// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./LotteryToken.sol";
import "./PriceConsumers.sol";

struct LotteryEvent {
    uint timestamp;
    string description;
}

contract Lottery {
    uint8 public immutable tokenDecimals; // Chain token decimals (ETH, MATIC, ...)
    uint public immutable entryPriceUsd;
    address payable public immutable fundsReleaseAddress;
    uint public immutable beginningOfParticipationPeriod;
    uint public immutable endOfParticipationPeriod;
    uint public immutable endOfPreparationPeriod;
    LotteryToken public immutable token;
    PriceConsumer public immutable priceConsumer;
    LotteryEvent[] public events;
    
    constructor(uint8 _tokenDecimals,
                uint _entryPriceUsd, 
                string memory _tokenName,
                string memory _tokenSymbol,
                string memory _CID, 
                address payable _fundsReleaseAddress,
                uint _beginningOfParticipationPeriod,
                uint _endOfParticipationPeriod,
                uint _endOfPreparationPeriod,
                PriceConsumer _priceConsumer,
                LotteryEvent[] memory _events) {
        // Validate periods
        require(_beginningOfParticipationPeriod > block.timestamp, "Invalid timestamp: beginningOfParticipationPeriod");
        require(_endOfParticipationPeriod > _beginningOfParticipationPeriod, "Invalid timestamp: endOfParticipationPeriod");
        require(_endOfPreparationPeriod > _endOfParticipationPeriod, "Invalid timestamp: endOfPreparationPeriod");
        
        // Validate events
        require(_events.length == 0 || _events[0].timestamp >= _endOfPreparationPeriod, "Invalid timestamp: First event");
        for(uint i = 1; i < _events.length; i++) {
            require(_events[i].timestamp > _events[i-1].timestamp, "Events timestamps not in ascending order");
        }

        // Create lottery token
        token = new LotteryToken(_tokenName, _tokenSymbol, _CID);

        tokenDecimals = _tokenDecimals;
        entryPriceUsd = _entryPriceUsd;
        fundsReleaseAddress = _fundsReleaseAddress;
        beginningOfParticipationPeriod = _beginningOfParticipationPeriod;
        endOfParticipationPeriod = _endOfParticipationPeriod;
        endOfPreparationPeriod = _endOfPreparationPeriod;
        priceConsumer = _priceConsumer;
        events = _events;
    }

    /*
        * Returns the current lottery state
    */
    function getState() external view returns(string memory) {
        if(block.timestamp < beginningOfParticipationPeriod) {
            return "Waiting for participation period";
        }

        if(block.timestamp < endOfParticipationPeriod) {
            return "Participation period is ongoing";
        }

        if(block.timestamp < endOfPreparationPeriod) {
            return "Preparation period is ongoing";
        }

        if(events.length > 0) {
            return "Waiting for the next event";
        }

        if(address(this).balance > 0) {
            return "Waiting for funds release";
        }

        return "Lottery completed";
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

    // Args test: [[0,0,0,0,0,0]]
    function participate(SpaceShips.Ship memory spaceShip) external payable {
        require(block.timestamp >= beginningOfParticipationPeriod && block.timestamp < endOfParticipationPeriod,
                    "Can't participate outside of the participation period");

        uint entryPrice = getPriceToParticipate();
        require(msg.value >= entryPrice, "Not enough funds to participate. See getPriceToParticipate()");

        token.mint(msg.sender, spaceShip);
    }

    /*
        * Releases the funds
    */
    function releaseFunds() public {
        require(block.timestamp >= endOfPreparationPeriod, "Lottery preparation is not over yet");
        require(events.length == 0, "There are still remaining events");

        fundsReleaseAddress.transfer(address(this).balance);
    }
}

//contract LotteryTest is Lottery(18, 19, "bafybeifvom64za2hjknz22q5bg472b2o4xcatmxdkgq76jfcrszjqy46nm", new PriceConsumerMaticUSD()) {
contract LotteryTest is Lottery {
    constructor() Lottery(18,
                          0, 
                          "Test5424243243",
                          "SS1",
                          "bafybeieebqajviqkc2atrecw7cej6wxkw3ns3squjgrgobmwl3royabe4a", 
                          payable(0xf585378ff2A1DeCb335b4899250b83F46DC5c019),
                          1637784300,
                          1637787900,
                          1637791500,
                          new PriceConsumerMaticUSD(),
                          new LotteryEvent[](0)) { }
}