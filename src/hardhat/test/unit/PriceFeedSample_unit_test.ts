import chai, { expect } from 'chai';
import BN from 'bn.js';
import { ethers, deployments } from 'hardhat';
import chainBN from "chai-bn";
import { PriceFeedSample } from '../../typechain';
chai.use(chainBN(BN))

describe('PriceConsumer Unit Tests', async function () {
    // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
    let priceFeedSample:PriceFeedSample;

    beforeEach(async () => {
        await deployments.fixture(['mocks', 'feed'])
        const PriceFeedSample = await deployments.get("PriceFeedSample")
        priceFeedSample = await ethers.getContractAt("PriceFeedSample", PriceFeedSample.address)
    })

    it('should return a positive value', async () => {
        let result = await priceFeedSample.getLatestPrice()
        console.log("Price Feed Value: ", ethers.BigNumber.from(result._hex).toString())
        expect(ethers.BigNumber.from(result._hex).toString()).to.be.bignumber.that.is.greaterThan(ethers.BigNumber.from(0).toString())
    })
})
