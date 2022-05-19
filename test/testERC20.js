const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FrozenERC20", function () {
  it("Should should mint 10 tokens to the deployer", async function () {
    const FrozenERC20 = await ethers.getContractFactory("FrozenERC20");
    const frozenERC20 = await FrozenERC20.deploy("Hello, world!");
    await frozenERC20.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
