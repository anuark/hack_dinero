require("dotenv").config();
const ethers = require("ethers");
const { FlashbotsBundleProvider } = require("@flashbots/ethers-provider-bundle");

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL);


// FROZEN_ASSETS address depending on deploy script
// const FROZEN_ASSETS = "0xa7C14aCAE047462A895EE3AF152A1538DB8f5aE0";
// const EXPOSED_EOA = new ethers.Wallet(process.env.EXPOSED_PK, provider);
// const SECURE_EOA = new ethers.Wallet(process.env.SECURE_PK, provider);

// parameters to receive from the front-end:
// 1. exposed EOA pk
// 2. secure EOA pk (from wallet)
// 3. address of smart contract holding frozen assets

export default async function reactrecoverERC721Funds(exposedEOA, secureEOA, frozenContract, abi) {

    const ERC721_ABI = [
        "function name() public view virtual override returns (string memory)",
        "function symbol() public view virtual override returns (string memory)",
        "function _exists(uint256 tokenId) internal view virtual returns (bool)",
        "function _safeMint(address to, uint256 tokenId) internal virtual",
        "function transferFrom(address from, address to, uint256 tokenId) public virtual override",
        "function balanceOf(address owner) public view virtual override returns (uint256)",
        "function ownerOf(uint256 tokenId) public view virtual override returns (address)",
    ];

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

    // 2.1 Find out how many tokens the address holds
    const NFTContract = new ethers.Contract(frozenContract, abi, exposedEOA);
    const balance = parseInt(await NFTContract.balanceOf(exposedEOA.address), 16);
    console.log("address NFT count is: ", balance)

    // 2.2 Find out which tokens the address holds
    const ownedTokens = [];
    let uniqueIVar = 0;
    while(ownedTokens.length < balance) {
        if(await NFTContract.ownerOf(uniqueIVar) == exposedEOA.address) {
            ownedTokens.push(uniqueIVar);
        } 
        uniqueIVar++;
    }

    // 3.0 initialize Tx bundle before it's used
    const transactionBundle = [{signedTransaction: fundTransaction}];

    // 3. from exposed EOA, make function call to frozen assets contract
    const nonce = await exposedEOA.getTransactionCount()
    
    let scopedNonce = nonce; // Not sure if global nonce is being used elsewhere
    for(let i=0; i<balance; i++) {
        let token = ownedTokens[i];
        const withdrawTx = await NFTContract.populateTransaction.transferFrom(exposedEOA.address,secureEOA.address, token, {
            nonce: scopedNonce,
            gasLimit:  await NFTContract.estimateGas.transferFrom(exposedEOA.address, secureEOA.address, token),
            gasPrice,
            value: 0
        })
        transactionBundle.push({
            signer: exposedEOA,
            transaction: withdrawTx
        });
        scopedNonce++;
    }
    console.log("this is the tx bundle: ", transactionBundle, "bundled with", transactionBundle.length - 1, "tokens to be transferred")

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

// reactrecoverERC721Funds(EXPOSED_EOA, SECURE_EOA, FROZEN_ASSETS, ERC721_ABI); 