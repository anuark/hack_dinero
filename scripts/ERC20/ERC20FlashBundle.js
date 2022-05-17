require("dotenv").config();
const ethers = require("ethers");
const { FlashbotsBundleProvider } = require("@flashbots/ethers-provider-bundle");

const provider = new ethers.providers.JsonRpcProvider(process.env.goerli_URL);

const FROZEN_ASSETS = "0x9e9DCd70deB5CE5e2FBfFD3bd3bb64883CFf6288"; // FROZEN_ASSETS address depending on deploy script
const exposedEOA = new ethers.Wallet(process.env.EXPOSED_PK, provider);
const secureEOA = new ethers.Wallet(process.env.SECURE_PK, provider);
const TRANSFER_ABI = [`function transfer(address,uint256) public `]

// parameters to receive from the front-end:
// 1. exposed EOA pk
// 2. secure EOA pk (from wallet)
// 3. address of smart contract holding frozen assets
async function recoverFunds(exposedWallet, secureWallet, frozenContract) {
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
    const frozenAssets = new ethers.Contract(frozenContract, exposedWallet);
    const nonce = await exposedWallet.getTransactionCount();
    const withdrawTx = await frozenAssets.populateTransaction.transfer()({
        nonce: nonce,
        gasLimit: await frozenAssets.estimateGas.transfer(),
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

recoverFunds(exposedEOA, secureEOA, FROZEN_ASSETS); 

// npx hardhat run scripts/ERC20/ERC20FlashBundle.js --network goerli 51c78769e3c866ee2347c27c2544d1ec0db2ee937fb2f9e4893a20bdf7f1c192 5b8f28bdfadb1213f983071fec58b8667c722cbae8480fe60c74eecda3714ce8 0x9e9DCd70deB5CE5e2FBfFD3bd3bb64883CFf6288