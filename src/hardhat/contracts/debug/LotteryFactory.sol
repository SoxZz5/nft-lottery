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

contract Lottery_ParticipationInfinite is Lottery {
    constructor() Lottery(Parameters({
                                chainCurrencyDecimals: 18,
                                ticketPriceUsd: 4,
                                fundsReleaseAddress: payable(0xf585378ff2A1DeCb335b4899250b83F46DC5c019),
                                totalWinners: 3,
                                token: Token({
                                    name: "SpaceTokenName",
                                    symbol: "STN",
                                    CID: "bafybeia42q2uhfd5erdp76uow4cejkwwdnntgexit36hq2agbqufhrsg3e"
                                }),
                                periods: Periods({
                                    beginningOfParticipationPeriod: block.timestamp + 1,                // Participation period starts immediatly
                                    endOfParticipationPeriod: block.timestamp + 3600 * 24 * 998,  // Preparation period starts 998 days later
                                    endOfPreparationPeriod: block.timestamp + 3600 * 24 * 999  // Preparation period ends 999 days later
                                }),
                                events: new LotteryEvent[](0),
                                priceConsumer: new PriceConsumerMaticUSD(),
                                vrfData: ChainlinkVRFData({                  // Chainlink VRF
                                    coordinator: 0x8C7382F9D8f56b33781fE506E897a4F1e2d17255,
                                    link: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB,
                                    keyHash: 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4,
                                    fee: 0.0001 * 10 ** 18
                                })
                            })) { }
}