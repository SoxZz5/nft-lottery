import { HardhatRuntimeEnvironment } from "hardhat/types";
import { networkConfig } from "../config/hardhat-sub-config";

module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId
} : HardhatRuntimeEnvironment) => {
    
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId() as keyof typeof networkConfig
    let ethUsdPriceFeedAddress:string
    if (+chainId == 31337) {
        // Local node 
        const EthUsdAggregator = await deployments.get('EthUsdAggregator')
        ethUsdPriceFeedAddress = EthUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed']
    }
    // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
    // Default one below is ETH/USD contract on Kovan
    log("----------------------------------------------------")
    log("deployer: " + deployer)
    log("ethUsdPriceFeedAddress: " + ethUsdPriceFeedAddress)
    log("----------------------------------------------------")
    const priceConsumer = await deploy('PriceConsumer', {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true
    })
    log("Run Price Feed contract with command:")
    log("npx hardhat read-price-feed --contract " + priceConsumer.address + " --network " + networkConfig[chainId]['name'])
    log("----------------------------------------------------")
    
}

module.exports.tags = ['all', 'feed', 'main']