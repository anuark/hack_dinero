const ethers = require('ethers');
const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle');

export default async function reactrecoverERC20Funds(EXPOSED_PK, SIGNER, frozenContract) {
  const GOERLI_URL = 'https://goerli.infura.io/v3/558772964f064b53a401decdde1ad4ed';
  const provider = new ethers.providers.JsonRpcProvider(GOERLI_URL);

  const ERC20_ABI = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address) view returns (uint)',
    'function transfer(address,uint256) external returns (bool)',
  ];

  const exposedEOA = new ethers.Wallet(EXPOSED_PK, provider);
  const secureADDR = SIGNER.getAddress();

  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    exposedEOA,
    'https://relay-goerli.flashbots.net/',
    'goerli'
  );

  const gasPrice = ethers.utils.parseUnits('1', 'gwei');

  // 1. fund exposed EOA from secure EOA
  const fundTransaction = await SIGNER.signTransaction({
    nonce: await SIGNER.getTransactionCount(),
    to: exposedEOA.address,
    gasPrice,
    gasLimit: 21000,
    value: ethers.utils.parseEther('.1'),
  });

  // 2. Find out how many tokens
  const frozenAssets = new ethers.Contract(frozenContract, ERC20_ABI, exposedEOA);
  const balance = await frozenAssets.balanceOf(exposedEOA.address);

  // 3. from exposed EOA, make function call to frozen assets contract
  const nonce = await exposedEOA.getTransactionCount();
  const withdrawTx = await frozenAssets.populateTransaction.transfer(secureADDR, balance, {
    nonce: nonce,
    gasLimit: await frozenAssets.estimateGas.transfer(secureADDR, balance),
    gasPrice,
    value: 0,
  });

  const transactionBundle = [
    {
      signedTransaction: fundTransaction,
    },
    {
      signer: exposedEOA,
      transaction: withdrawTx,
    },
  ];
  console.log('bundled');
  // send bundle to flashbot provider
  const signedBundle = await flashbotsProvider.signBundle(transactionBundle);
  console.log('signed');
  const blockNumber = await provider.getBlockNumber();
  console.log('Block number recieved');
  const simulation = await flashbotsProvider.simulate(signedBundle, blockNumber);
  if (!simulation.results) {
    console.log('This is the simulation:', simulation);
  }
  console.log('sent');
  // wait for bundle execution to complete
  provider.on('block', async (blockNumber) => {
    console.log(blockNumber);
    const response = await flashbotsProvider.sendBundle(transactionBundle, blockNumber + 1);
    const waitResponse = await response.wait();
    if (waitResponse === 0) {
      console.log('success');
      process.exit();
    }
  });
}

// reactrecoverERC20Funds(EXPOSED_EOA, SECURE_EOA, FROZEN_ASSETS, ERC20_ABI);
