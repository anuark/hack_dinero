require("dotenv").config();
const ethers = require("ethers");
const { FlashbotsBundleProvider } = require("@flashbots/ethers-provider-bundle");

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL);

const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
    "function transfer(address,uint256) external returns (bool)",
];

// FROZEN_ASSETS address depending on deploy script
const FROZEN_ASSETS = "0x45Ac2eF3a0572F2B5ae36B0a11619ce82BEb3bDa";
const EXPOSED_EOA = new ethers.Wallet(process.env.EXPOSED_PK, provider);
const SECURE_EOA = new ethers.Wallet(process.env.SECURE_PK, provider);

// parameters to receive from the front-end:
// 1. exposed EOA pk
// 2. secure EOA pk (from wallet)
// 3. address of smart contract holding frozen assets
async function recoverFunds(exposedEOA, secureEOA, frozenContract, abi) {
    const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider,
        exposedEOA,
        'https://relay-goerli.flashbots.net/',
        'goerli'
    );

    const gasPrice = ethers.utils.parseUnits("1", "gwei");

    // 1. fund exposed EOA from secure EOA
    const fundTransaction = await secureEOA.signTransaction({
        nonce: await secureEOA.getTransactionCount(),
        to: exposedEOA.address,
        gasPrice,
        gasLimit: 21000,
        value: ethers.utils.parseEther(".1")
    });

    // 2. Find out how many tokens
    const frozenAssets = new ethers.Contract(frozenContract, abi, exposedEOA);
    const balance = await frozenAssets.balanceOf(exposedEOA.address);

    // 3. from exposed EOA, make function call to frozen assets contract
    const nonce = await exposedEOA.getTransactionCount()
    const withdrawTx = await frozenAssets.populateTransaction.transfer(secureEOA.address, balance, {
        nonce: nonce,
        gasLimit:  await frozenAssets.estimateGas.transfer(secureEOA.address, balance),
        gasPrice,
        value: 0
    })

    const transactionBundle = [{
        signedTransaction: fundTransaction
    },
    {
        signer: exposedEOA,
        transaction: withdrawTx
    }];
    console.log("bundled")
    // send bundle to flashbot provider
    const signedBundle = await flashbotsProvider.signBundle(transactionBundle);
    console.log("signed")
    const blockNumber = await provider.getBlockNumber();
    console.log("Block number recieved")
    const simulation = await flashbotsProvider.simulate(signedBundle, blockNumber);
    if(!simulation.results) {
        console.log("This is the simulation:", simulation);
    }
    console.log("sent")
    // wait for bundle execution to complete
    provider.on("block", async (blockNumber) => {
        console.log(blockNumber);
        const response = await flashbotsProvider.sendBundle(transactionBundle, blockNumber + 1);
        const waitResponse = await response.wait();
        if(waitResponse === 0) {
            console.log("success");
            process.exit();
        }
    });
}

recoverFunds(EXPOSED_EOA, SECURE_EOA, FROZEN_ASSETS, ERC20_ABI); 