const { ethers, upgrades } = require("hardhat");


async function main() {
  const InsuranceV1 = await ethers.getContractFactory("Insurance.sol");
  const InsuranceProxy = await upgrades.deployProxy(InsuranceV1);
  await InsuranceProxy.deployed();

  console.log(InsuranceProxy.address);
  console.log("----------")
  console.log("Verification command below: USE IMPLEMENTATION ADDRESS")
  console.log("npx hardhat verify --network rinkeby")
}

main();