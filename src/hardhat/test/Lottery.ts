import chai, { expect } from 'chai';
import BN from 'bn.js';
import { ethers, deployments } from 'hardhat';
import chainBN from "chai-bn";
import { Lottery } from '../typechain';
import { networkConfig } from "../config/hardhat-sub-config";
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
    
    const { deploy, log } = deployments;
    const result = await deploy('Lottery', {
        from: deployer,
        args: [
            [
                "18",
                "4",
                "0xf585378ff2A1DeCb335b4899250b83F46DC5c019",
                "3",
                [
                    "LotteryTokenName",
                    "LTN",
                    "bafybeia42q2uhfd5erdp76uow4cejkwwdnntgexit36hq2agbqufhrsg3e"
                ],
                [
                    currentUnixTimeStamp + 100,
                    currentUnixTimeStamp + 101,
                    currentUnixTimeStamp + 102
                ],
                [
                    [
                        currentUnixTimeStamp + 103,
                        "Event 1"
                    ],
                    [
                        currentUnixTimeStamp + 104,
                        "Event 1"
                    ]
                ],
                deployedPriceConsumer.address,
                [
                    deployedVRFCoordinator.address,
                    deployedLINK.address,
                    networkConfig[chainId]['keyHash'],
                    networkConfig[chainId]['fee']
                ]
            ],
        ],
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