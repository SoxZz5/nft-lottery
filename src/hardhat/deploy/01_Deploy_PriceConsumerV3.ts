import { networkConfig } from "../config/hardhat-sub-config";

module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId
} : {
    getNamedAccounts: Function,
    deployments: any,
    getChainId: Function
}) => {

    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()
    let ethUsdPriceFeedAddress:string
    if (chainId == 31337) {
        const EthUsdAggregator = await deployments.get('EthUsdAggregator')
        ethUsdPriceFeedAddress = EthUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId as keyof typeof networkConfig]['ethUsdPriceFeed']
    }
    // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
    // Default one below is ETH/USD contract on Kovan
    log("----------------------------------------------------")
    log("deployer: " + deployer)
    log("ethUsdPriceFeedAddress: " + ethUsdPriceFeedAddress)
    log("----------------------------------------------------")
    const priceFeedSample = await deploy('PriceFeedSample', {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true
    })
    log("Run Price Feed contract with command:")
    log("npx hardhat read-price-feed --contract " + priceFeedSample.address + " --network " + networkConfig[chainId as keyof typeof networkConfig]['name'])
    log("----------------------------------------------------")

}

module.exports.tags = ['all', 'feed', 'main']