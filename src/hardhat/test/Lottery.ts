import chai, { expect } from 'chai';
import BN from 'bn.js';
import { ethers, deployments } from 'hardhat';
import chainBN from "chai-bn";
import { Lottery } from '../typechain';
import { networkConfig } from "../config/hardhat-sub-config";
import { Parameters, Periods, Token, LotteryEvent, ChainlinkVRFData } from "../types/Lottery"
import { uint8, uint256 } from '../types/Integers';
chai.use(chainBN(BN))

const createLotteryFixture = deployments.createFixture(async hre => {
    // Ensure starting from fresh deployments
    await deployments.fixture(['mocks', 'feed']);
    
    // Get deployments
    const deployedPriceConsumer = await deployments.get("PriceConsumer");
    const deployedLINK = await deployments.get("LinkToken");
    const deployedVRFCoordinator = await deployments.get("VRFCoordinatorMock");
    
    // Get signers
    const { deployer } = await hre.getNamedAccounts();
    
    const currentUnixTimeStamp = Math.floor(new Date().getTime() / 1000);
    const chainId = await hre.getChainId() as keyof typeof networkConfig;
    
    // TODO implement chainId condition
    // if (+chainId == 31337) {
    //     // Local node 
    //     const EthUsdAggregator = await deployments.get('EthUsdAggregator')
    //     ethUsdPriceFeedAddress = EthUsdAggregator.address
    // } else {
    //     ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed']
    // }
    
    const periods: Periods = {
        beginningOfParticipationPeriod: new uint256(currentUnixTimeStamp + 100),
        endOfParticipationPeriod: new uint256(currentUnixTimeStamp + 101),
        endOfPreparationPeriod: new uint256(currentUnixTimeStamp + 102)
    };
    
    const tokenInfo: Token = {
        name: "LotteryTokenName",
        symbol: "LTN",
        CID: "bafybeia42q2uhfd5erdp76uow4cejkwwdnntgexit36hq2agbqufhrsg3e"
    };
    
    const events: LotteryEvent[] = [
        {    
            timestamp: new uint256(currentUnixTimeStamp + 103),
            description: "Event 1"
        },
        {    
            timestamp: new uint256(currentUnixTimeStamp + 104),
            description: "Event 2"
        }
    ];
    
    const vrfData: ChainlinkVRFData = {
        coordinator: deployedVRFCoordinator.address,
        link: deployedLINK.address,
        keyHash: networkConfig[chainId]['keyHash'],
        fee: new uint256(networkConfig[chainId]['fee'])
    };
    
    const lotteryParameters: Parameters = {
        chainCurrencyDecimals: new uint8(18),
        ticketPriceUsd: new uint256(4),
        fundsReleaseAddress: "0xf585378ff2A1DeCb335b4899250b83F46DC5c019",
        totalWinners: new uint256(3),
        token: tokenInfo,
        periods: periods,
        events: events,
        priceConsumer: deployedPriceConsumer.address,
        vrfData: vrfData
    };
    
    await deployments.deploy('Lottery', {
        from: deployer,
        args: [lotteryParameters],
        log: true
    });
});

describe('Lottery Unit Tests', async function () {
    let lottery:Lottery;
    
    beforeEach(async () => {
        await createLotteryFixture();
        const deployedLottery = await deployments.get("Lottery")
        lottery = await ethers.getContractAt("Lottery", deployedLottery.address);
        
        console.log("Lottery successfully deployed at: " + lottery.address);
    })
    
    it('test description', async () => {
        expect(true);
    })
})