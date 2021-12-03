import chai, { expect } from 'chai';
import BN from 'bn.js';
import { ethers, deployments } from 'hardhat';
import chainBN from "chai-bn";
import { PriceConsumer } from '../../typechain';
chai.use(chainBN(BN))

describe('PriceConsumer Unit Tests', async function () {
    // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
    let priceConsumer:PriceConsumer;

    beforeEach(async () => {
        await deployments.fixture(['mocks', 'feed']);
        const priceFeedContract = await deployments.get("PriceConsumer");
        priceConsumer = await ethers.getContractAt("PriceConsumer", priceFeedContract.address);
    })

    // TODO check equals the initial price set instead
    it('should return a positive value', async () => {
        let result = await priceConsumer.getLatestPrice();
        console.log("Price Feed Value: ", ethers.BigNumber.from(result._hex).toString());
        expect(ethers.BigNumber.from(result._hex).toString()).to.be.bignumber.that.is.greaterThan(ethers.BigNumber.from(0).toString());
    })
})
