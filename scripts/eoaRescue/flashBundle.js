require("dotenv").config();
const ethers = require("ethers");
const { FlashbotsBundleProvider } = require("@flashbots/ethers-provider-bundle");

// TODO: post FROZEN_ASSETS
const FROZEN_ASSETS = "0xA1C39D6C3edd16bA13972Abb5a969c5E8b7C770b";

async function recoverFunds() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL);

    const compromisedWallet = new ethers.Wallet(process.env.EXPOSED_PK, provider);
    const funderWallet = new ethers.Wallet(process.env.SECURE_PK, provider);

    const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider,
        compromisedWallet,
        'https://relay-goerli.flashbots.net/',
        'goerli'
    );

    const gasPrice = ethers.utils.parseUnits("1", "gwei");

    // 1. fund exposed EOA from secure EOA
    const fundTransaction = await funderWallet.signTransaction({
        nonce: await funderWallet.getTransactionCount(),
        to: compromisedWallet.address,
        gasPrice,
        gasLimit: 21000,
        value: ethers.utils.parseEther(".1")
    });
    
    // 2. from exposed EOA, make function call to FROZEN_ASSETS contract
    const abi = ["function withdraw() external"]
    const frozenAssets = new ethers.Contract(FROZEN_ASSETS, abi, compromisedWallet);
    const nonce = await compromisedWallet.getTransactionCount();
    const withdrawTx = await frozenAssets.populateTransaction.withdraw({
        nonce: nonce,
        gasLimit: await frozenAssets.estimateGas.withdraw(),
        gasPrice,
        value: 0
    });

    // 3. from exposed EOA, send frozen assets to secure EOA
    const fundTransaction2 = await compromisedWallet.signTransaction({
        nonce: nonce + 1,
        to: funderWallet.address,
        gasPrice,
        gasLimit: 21000,
        value: ethers.utils.parseEther(".1")
    });

    // bundle txs: [1,2,3]^
    const transactionBundle = [{
        signedTransaction: fundTransaction
    }, {
        signer: compromisedWallet,
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

recoverFunds();