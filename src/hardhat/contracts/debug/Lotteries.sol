// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../Lottery.sol";

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
    constructor() Lottery(18,                                                                   // Current chain token decimals. MATIC/ETH = 18
                            19,                                                                 // Entry price. TESTING. Should be 19
                            "Test5424243243",                                                   // Token name
                            "SS1",                                                              // Token symbol
                            "bafybeia42q2uhfd5erdp76uow4cejkwwdnntgexit36hq2agbqufhrsg3e",  // CID
                            payable(0xf585378ff2A1DeCb335b4899250b83F46DC5c019), // Charity address
                            Periods({
                                beginningOfParticipationPeriod: block.timestamp + 60 * 5,    // Participation period starts 5 minutes later
                                endOfParticipationPeriod: block.timestamp + 60 * 10,         // Preparation period starts 10 minutes later
                                endOfPreparationPeriod: block.timestamp + 60 * 15            // Preparation period ends 15 minutes later
                            }),
                            3,                           // Max winners
                            new PriceConsumerMaticUSD(), // Chainlink Price Feed
                            ChainlinkVRFData({           // Chainlink VRF
                                coordinator: 0x8C7382F9D8f56b33781fE506E897a4F1e2d17255,
                                link: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB,
                                keyHash: 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4,
                                fee: 0.0001 * 10 ** 18
                            })) { }
}

contract LotteryParticipationInfinite is Lottery {
    constructor() Lottery(18,                                                                   // Current chain token decimals. MATIC/ETH = 18
                            4,                                                                  // Entry price. TESTING. Should be 19
                            "SpaceTokenName",                                                   // Token name
                            "STN",                                                              // Token symbol
                            "bafybeia42q2uhfd5erdp76uow4cejkwwdnntgexit36hq2agbqufhrsg3e",  // CID
                            payable(0xf585378ff2A1DeCb335b4899250b83F46DC5c019), // Charity address
                            Periods({
                                beginningOfParticipationPeriod: block.timestamp + 1,                // Participation period starts immediatly
                                endOfParticipationPeriod: block.timestamp + 3600 * 24 * 998,  // Preparation period starts 998 days later
                                endOfPreparationPeriod: block.timestamp + 3600 * 24 * 999  // Preparation period ends 999 days later
                            }),
                            3,                                  // Max winners
                            new PriceConsumerMaticUSD(),        // Chainlink Price Feed
                            ChainlinkVRFData({                  // Chainlink VRF
                                coordinator: 0x8C7382F9D8f56b33781fE506E897a4F1e2d17255,
                                link: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB,
                                keyHash: 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4,
                                fee: 0.0001 * 10 ** 18
                            })) { }
}