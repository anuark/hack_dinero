const { expect } = require('chai');
const { ethers } = require('hardhat');
// const abi = require("../artifacts/contracts/FrozenERC721.sol/FrozenERC721.json");

describe('FrozenERC721', function () {
  const gasPrice = ethers.utils.parseUnits('1', 'gwei');
  const ownedTokens = [];
  let frozenNfts;
  let exposedEOA;
  let secureEOA;
  let balance;

  beforeEach(async () => {
    // deploy
    [exposedEOA, secureEOA] = await ethers.getSigners();
    const FrozenERC721 = await ethers.getContractFactory('FrozenERC721');
    frozenNfts = await FrozenERC721.deploy('FrozenNFT', 'FZNF');
    await frozenNfts.deployed();
    console.log(`
    exposed  eoa: ${exposedEOA.address}
    secured  eoa: ${secureEOA.address}
    nft contract: ${frozenNfts.address}`);

    // mint NFTs
    for (let i = 0; i < 3; i++) {
      frozenNfts.mint();
    }
  });

  it('check for balance of NFTs in exposedEOA', async function () {
    balance = await parseInt(await frozenNfts.balanceOf(exposedEOA.address), 16);
    expect(balance > 0);
  });

  it('filter tokenIDs of NFTs for exposedEOA', async function () {
    let i = 0;
    while (ownedTokens.length < balance) {
      if ((await frozenNfts.ownerOf(i)) == exposedEOA.address) {
        ownedTokens.push(i);
      }
      i++;
    }
    console.log(`token IDs: ${ownedTokens}`);
    expect(ownedTokens.length == balance);
  });

  it('transfer all NFTs from exposedEOA to secureEOA', async function () {
    for (let i = 0; i < balance; i++) {
      await frozenNfts.transferFrom(exposedEOA.address, secureEOA.address, ownedTokens[i], {
        gasPrice,
        value: 0,
      });
    }
  });
});
