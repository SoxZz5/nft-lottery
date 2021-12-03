import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "solidity-coverage";

// Tasks
import "./src/hardhat/tasks/read-price-feed";

dotenv.config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.9"
      },
      {
        version: "0.6.6"
      },
      {
        version: "0.4.24"
      }
    ]
  },
  networks: {
    kovan: {
      url: process.env.KOVAN_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      saveDeployments: true
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      saveDeployments: true
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    root: "./src/hardhat/",
  },
  namedAccounts: {
    deployer: {
      default: 0, // takes the first account as deployer
      mumbai: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    player1: { default: 1, mumbai: 1 },
    player2: { default: 2, mumbai: 2 },
    player3: { default: 3, mumbai: 3 },
    player4: { default: 4, mumbai: 4 },
    player5: { default: 5, mumbai: 5 },
    player6: { default: 6, mumbai: 6 },
    player7: { default: 7, mumbai: 7 },
    player8: { default: 8, mumbai: 8 },
    player9: { default: 9, mumbai: 9 },
    player10: { default: 10, mumbai: 10 }
    // If more players are needed, consider adding them using a for() loop
  },
};

export default config;
