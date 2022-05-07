const { ethers, upgrades } = require("hardhat");


async function main() {
  const FlashBotHeroV1 = await ethers.getContractFactory("FlashBotHero.sol");
  const FlashBotproxy = await upgrades.deployProxy(FlashBotHeroV1);
  await FlashBotproxy.deployed();

  console.log(FlashBotproxy.address);
  console.log("----------")
  console.log("Verification command below: USE IMPLEMENTATION ADDRESS")
  console.log("npx hardhat verify --network rinkeby")
}

main();