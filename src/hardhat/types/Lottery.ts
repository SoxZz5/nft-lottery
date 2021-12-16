import { BigNumber } from "@ethersproject/bignumber";

export interface Parameters {
    chainCurrencyDecimals: number;
    ticketPriceUsd: number;
    fundsReleaseAddress: string;
    totalWinners: number;
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
    beginningOfParticipationPeriod: number;
    endOfParticipationPeriod: number;
    endOfPreparationPeriod: number;
}

export interface LotteryEvent {
    timestamp: number;
    description: string;
}

export interface ChainlinkVRFData {
    coordinator: string;
    link: string;
    keyHash: string;
    fee: BigNumber;
}

export enum LotteryState 
{ 
    WaitingForLINK,
    WaitingForParticipationPeriod, 
    OngoingParticipationPeriod, 
    OngoingPreparationPeriod,
    WaitingForNextEvent,
    WaitingForFundsRelease,
    Complete 
}