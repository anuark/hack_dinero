const { ethers } = require('hardhat');

async function main() {
  const ERC721Contract = await ethers.getContractFactory('FrozenERC721');
  const erc721Contract = await ERC721Contract.deploy('FrozenNFT', 'FZNF', { value: ethers.utils.parseEther('.02') });
  await erc721Contract.deployed();

  console.log('Asset frozen at:', erc721Contract.address);
}

main();

// Arguments in verification script are NOT comma seperated: `"FrozenNFT" "FZNF"`
// npx hardhat verify --network goerli 0xa7C14aCAE047462A895EE3AF152A1538DB8f5aE0 "FrozenNFT" "FZNF"
