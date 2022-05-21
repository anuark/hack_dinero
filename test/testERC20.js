const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FrozenERC20", function () {
  let FrozenERC20;
  let owner;
  let secure1;
  let exposed1;
  let secure2;
  let exposed2;
  let FrozenERC20Contract;

  function humanReadable(num) {
    return parseInt(ethers.utils.formatEther(num));
  }
  function EVMReadable(num) {
    return ethers.utils.parseEther(num.toString());
  }

  before(async function () {
    [owner, secure1, exposed1, secure2, exposed2] = await ethers.getSigners();

    FrozenERC20 = await ethers.getContractFactory("FrozenERC20");
    FrozenERC20Contract = await FrozenERC20.deploy();
    await FrozenERC20Contract.deployed();
  });

  describe("The contract", function () {
    it("Should deploy with total supply in owners address", async function () {
      const ownerBalance = humanReadable(await FrozenERC20Contract.balanceOf(owner.address));
      expect(ownerBalance).to.equal(100);
    });
  });
  describe("Owner should be able to transfer tokens to 'exposed' accounts", function () {
    before(async function () {
      await FrozenERC20Contract.connect(owner).transfer(exposed1.address, EVMReadable(10));
      await FrozenERC20Contract.connect(owner).transfer(exposed2.address, EVMReadable(10));
    });
    it("Should decrease tokens inside of owners address", async function () {
      const ownerBalance = humanReadable(await FrozenERC20Contract.balanceOf(owner.address));
      expect(ownerBalance).to.equal(80);
    });
    it("should make exposed1's balanceOf equal 10 tokens", async function () {
      const exposed1Balance = humanReadable(await FrozenERC20Contract.balanceOf(exposed1.address));
      expect(exposed1Balance).to.equal(10);
    });
    it("should make exposed2's balanceOf equal 10 tokens", async function () {
      const exposed2Balance = humanReadable(await FrozenERC20Contract.balanceOf(exposed2.address));
      expect(exposed2Balance).to.equal(10);
    });
  });
});
