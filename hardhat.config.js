require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");

module.exports = {
  solidity: "0.8.4",
  // gasReporter: {
  //   currency: 'USD',
  //   coinmarketcap: process.env.COINMARKET_KEY,
  //   gasPriceApi: "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice"
  // },
  networks: {
    goerli: {
      url: process.env.goerli_URL,
      accounts: [process.env.EXPOSED_PK]
    }
  },
  etherscan: { 
    apiKey: {
      goerli: process.env.ETHERSCAN_KEY,
      rinkeby: process.env.ETHERSCAN_KEY,
      ropsten: process.env.ETHERSCAN_KEY
    }
  }
};