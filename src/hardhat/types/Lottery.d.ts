import { BigNumber, BigNumberish } from "ethers";
import { uint8, uint256 } from "./Integers" 

export interface Parameters {
    chainCurrencyDecimals: uint8;
    ticketPriceUsd: uint256;
    fundsReleaseAddress: string;
    totalWinners: uint256;
    token: Token;
    periods: Periods;
    events: LotteryEvent[];
    priceConsumer: string;
    vrfData: ChainlinkVRFData;
}

export interface Token {
    name: string;
    symbol: string;
    CID: string;
}

export interface Periods {
    beginningOfParticipationPeriod: uint256;
    endOfParticipationPeriod: uint256;
    endOfPreparationPeriod: uint256;
}

export interface LotteryEvent {
    timestamp: uint256;
    description: string;
}

export interface ChainlinkVRFData {
    coordinator: string;
    link: string;
    keyHash: string;
    fee: uint256;
}