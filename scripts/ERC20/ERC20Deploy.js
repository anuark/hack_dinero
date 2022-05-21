async function main() {
  const ERC20Contract = await ethers.getContractFactory('FrozenERC20');
  const erc20Contract = await ERC20Contract.deploy({ value: ethers.utils.parseEther('.02') });
  await erc20Contract.deployed();

  console.log('Assets frozen at:', erc20Contract.address);
}

main();
