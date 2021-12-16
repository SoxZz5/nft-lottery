import chai, { expect } from 'chai';
import "@appliedblockchain/chainlink-plugins-fund-link";
import { Lottery } from '../typechain';
import { LotteryState } from "../types/Lottery"
import { getDefaultParameters, lotteryFixture, getSignersIdentity } from './utils';
import { BigNumber } from '@ethersproject/bignumber';
chai.use(require('chai-bn')(BigNumber));

describe('Lottery Unit Tests', async function () {
    let lottery:Lottery;
    
    // beforeEach(async () => {
    //     await createLotteryFixture();
    //     const deployedLottery = await deployments.get("Lottery")
    //     lottery = await ethers.getContractAt("Lottery", deployedLottery.address);
        
    //     console.log("Lottery successfully deployed at: " + lottery.address);
    // })
    
    it('State check/WaitingForLINK', async () => {
        // Generate a new lottery and keep a reference to its parameters
        const lotteryParameters = await getDefaultParameters();
        const lottery = await lotteryFixture(lotteryParameters);

        // Verify state
        const state = await lottery.getState();
        expect(state).to.be.equal(LotteryState.WaitingForLINK);

        // Verify link amount to pay
        const linkFeesToPay = lotteryParameters.vrfData.fee.mul(BigNumber.from(lotteryParameters.events.length));
        const linkFeesToPayFromContract = await lottery.getLINKAmountRequired();
        expect(linkFeesToPay).to.be.equal(linkFeesToPayFromContract);
    });
    
    it('State check/WaitingForParticipationPeriod', async () => {
        // Generate a new lottery
        const lottery = await lotteryFixture();

        const { deployer, player1 } = await getSignersIdentity();
        
        const linkAmount = await deployer.link.balanceOf(deployer.signer.address);
        // Using the local node, some LINK should have been funded to the deployer
        expect(linkAmount).to.be.bignumber.greaterThan(BigNumber.from(0));

        
        let state = await lottery.getState();
        expect(state).to.be.equal(LotteryState.WaitingForLINK);

        const linkFeesToPay = await lottery.getLINKAmountRequired();
        await deployer.link.transfer(lottery.address, linkFeesToPay);
        
        state = await lottery.getState();
        expect(state).to.be.equal(LotteryState.WaitingForParticipationPeriod);

        console.log(state);
        //const LinkToken = await hre.deployments.get('LinkToken')
        //const linkFeesToPayFromContract = await lottery.getLINKAmountRequired();

        //const fundLinkResult = await hre.fundLink(hre, lottery.address, linkFeesToPayFromContract.toString(), LinkToken.address);

        // Verify state
        // const state = await lottery.getState();
        // expect(state).to.be.equal(LotteryState.WaitingForParticipationPeriod);
    });
})