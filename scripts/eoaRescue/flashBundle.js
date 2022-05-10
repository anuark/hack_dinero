require("dotenv").config();
const ethers = require("ethers");
const { FlashbotsBundleProvider } = require("@flashbots/ethers-provider-bundle");

const FROZEN_ASSETS = "0xA1C39D6C3edd16bA13972Abb5a969c5E8b7C770b"; // FROZEN_ASSETS address depending on deploy script
const exposedEOA = new ethers.Wallet(process.env.EXPOSED_PK, provider);
const secureEOA = new ethers.Wallet(process.env.SECURE_PK, provider);
const abiCall = ["function withdraw() external"]

// parameters to receive from the front-end:
// 1. exposed EOA pk
// 2. secure EOA pk (from wallet)
// 3. address of smart contract holding frozen assets
// 4. abi function call to retrieve assets
async function recoverFunds(exposedWallet, secureWallet, frozenContract, abi) {
    const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL);

    const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider,
        exposedWallet,
        'https://relay-goerli.flashbots.net/',
        'goerli'
    );

    const gasPrice = ethers.utils.parseUnits("1", "gwei");

    // 1. fund exposed EOA from secure EOA
    const fundTransaction = await secureWallet.signTransaction({
        nonce: await secureWallet.getTransactionCount(),
        to: exposedWallet.address,
        gasPrice,
        gasLimit: 21000,
        value: ethers.utils.parseEther(".1")
    });
    
    // 2. from exposed EOA, make function call to frozen assets contract
    const frozenAssets = new ethers.Contract(frozenContract, abi, exposedWallet);
    const nonce = await exposedWallet.getTransactionCount();
    const withdrawTx = await frozenAssets.populateTransaction.withdraw({
        nonce: nonce,
        gasLimit: await frozenAssets.estimateGas.withdraw(),
        gasPrice,
        value: 0
    });

    // 3. from exposed EOA, send frozen assets to secure EOA
    const fundTransaction2 = await exposedWallet.signTransaction({
        nonce: nonce + 1,
        to: secureWallet.address,
        gasPrice,
        gasLimit: 21000,
        value: ethers.utils.parseEther(".1")
    });

    // bundle txs: [1,2,3]^
    const transactionBundle = [{
        signedTransaction: fundTransaction
    }, {
        signer: exposedWallet,
        transaction: withdrawTx
    }, {
        signedTransaction: fundTransaction2
    }];

    // send bundle to flashbot provider
    const signedBundle = await flashbotsProvider.signBundle(transactionBundle);
    const blockNumber = await provider.getBlockNumber();
    const simulation = await flashbotsProvider.simulate(signedBundle, blockNumber);
    if(!simulation.results) {
        console.log(simulation);
    }

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

recoverFunds(exposedEOA, secureEOA, FROZEN_ASSETS, abiCall);