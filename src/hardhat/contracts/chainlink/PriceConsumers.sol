// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumer {
    AggregatorV3Interface private immutable _aggregator;

    constructor(address feedAddress) {
        _aggregator = AggregatorV3Interface(feedAddress);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() external view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = _aggregator.latestRoundData();
        return price;
    }

    /**
     * Returns the price decimals
     */
    function decimals() external view returns (uint8) {
        return _aggregator.decimals();
    }
}

contract PriceConsumerMaticUSD is PriceConsumer {

    /**
     * Network: Polygon
     * Aggregator: MATIC/USD
     * Address (mainnet): 0xAB594600376Ec9fD91F8e885dADF0CE036862dE0
     * Address (testnet): 0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
     * From: https://docs.chain.link/docs/matic-addresses/
     */
    constructor() PriceConsumer(0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada) { }
}