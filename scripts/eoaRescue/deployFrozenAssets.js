async function main() {
  const FrozenAssets = await ethers.getContractFactory("FrozenAssets");
  const frozenAssets = await FrozenAssets.deploy({ value: ethers.utils.parseEther(".02") });
  await frozenAssets.deployed();

  console.log("Assets frozen at:",  frozenAssets.address);
}

main();