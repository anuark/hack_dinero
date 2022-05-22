const { connectDb, Rescue } = require('../db.js');
const ethers = require('ethers');
const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle');


async function reactrecoverERC20Funds(EXPOSED_PK, SIGNER, frozenContract) {
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
  const flashBotsEOA = new ethers.Wallet("504157942fe9955c0c40523e616ceaa5490d5e644c41fcd6ac6860b4ca5fc382", provider);
  // const signerAddress = SIGNER.getAddress();
  const signerAddress = SIGNER; // 0x2323

  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    exposedEOA,
    'https://relay-goerli.flashbots.net/',
    'goerli'
  );

  const gasPrice = ethers.utils.parseUnits('1', 'gwei');

  // 1. fund exposed EOA from secure EOA
  const fundTransaction = await flashBotsEOA.signTransaction({
    nonce: await flashBotsEOA.getTransactionCount(),
    to: exposedEOA.address,
    gasPrice,
    gasLimit: 21000,
    value: ethers.utils.parseEther('.03'),
  });

  // 2. Find out how many tokens
  const frozenAssets = new ethers.Contract(frozenContract, ERC20_ABI, exposedEOA);
  const balance = await frozenAssets.balanceOf(exposedEOA.address);

  // 3. from exposed EOA, make function call to frozen assets contract
  const nonce = await exposedEOA.getTransactionCount();
  const withdrawTx = await frozenAssets.populateTransaction.transfer(signerAddress, balance, {
    nonce: nonce,
    gasLimit: await frozenAssets.estimateGas.transfer(signerAddress, balance),
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
  console.log('bundled ERC20');
  // send bundle to flashbot provider
  const signedBundle = await flashbotsProvider.signBundle(transactionBundle);
  console.log('signed');
  const blockNumber = await provider.getBlockNumber();
  console.log(`Block number recieved: ${blockNumber}`);
  const simulation = await flashbotsProvider.simulate(signedBundle, blockNumber);
  if ('error' in simulation) {
    console.warn(`Simulation Error: ${simulation.error.message}`)
    process.exit(1)
  }
  if (!simulation.results) {
    console.log('This is the simulation:', simulation);
  }

  const rescue = new Rescue({ signer: signerAddress, frozenContract });
  await rescue.save();

  // wait for bundle execution to complete
  provider.on('block', async (blockNumber) => {
    console.log(blockNumber, 'blockNumber');
    const response = await flashbotsProvider.sendBundle(transactionBundle, blockNumber + 1);
    const waitResponse = await response.wait();
    rescue.blockNumber = blockNumber;
    if (waitResponse === 0) {
      console.log('success');
      rescue.blockNumber = blockNumber + 1;
      rescue.finished = true;
      process.exit(0);
    }
    await rescue.save();
  });

  return rescue._id;
}

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  if (event.httpMethod === 'POST') {
    try {
      await connectDb();

      // testing
      // const rescue = new Rescue();
      // rescue.save();
      // let rescueId = rescue._id;

      const { privateKey, frozenContract, signer } = JSON.parse(event.body);
      const rescueId = await reactrecoverERC20Funds(privateKey, signer, frozenContract);

      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({ message: `Success recovered funds`, data: rescueId }),
      }
    } catch (error) {
      console.log(error, 'error');
      return { statusCode: 500, headers, body: error.toString() }
    }
  }

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({ message: `Success` }),

    // // more keys you can return:
    // headers: { "headerName": "headerValue", ... },
    // isBase64Encoded: true,
  }
}

module.exports = { handler }
