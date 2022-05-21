const ethers = require("ethers");
const { FlashbotsBundleProvider } = require("@flashbots/ethers-provider-bundle");


export default async function reactrecoverERC721Funds(EXPOSED_PK, SIGNER, frozenContract) {

    const GOERLI_URL="https://goerli.infura.io/v3/558772964f064b53a401decdde1ad4ed"
    const provider = new ethers.providers.JsonRpcProvider(GOERLI_URL);

    const ERC721_ABI = [
        "function name() public view virtual override returns (string memory)",
        "function symbol() public view virtual override returns (string memory)",
        "function _exists(uint256 tokenId) internal view virtual returns (bool)",
        "function _safeMint(address to, uint256 tokenId) internal virtual",
        "function transferFrom(address from, address to, uint256 tokenId) public virtual override",
        "function balanceOf(address owner) public view virtual override returns (uint256)",
        "function ownerOf(uint256 tokenId) public view virtual override returns (address)",
    ];

    const exposedEOA = new ethers.Wallet(EXPOSED_PK, provider);
    const secureADDR = SIGNER.getAddress();

    const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider,
        exposedEOA,
        'https://relay-goerli.flashbots.net/',
        'goerli'
    );

    const gasPrice = ethers.utils.parseUnits("1", "gwei");

    // 1. fund exposed EOA from secure EOA
    //signer.signTransaction
    const fundTransaction = await SIGNER.signTransaction({
        nonce: await SIGNER.getTransactionCount(),
        to: exposedEOA.address,
        gasPrice,
        gasLimit: 21000,
        value: ethers.utils.parseEther(".1")
    });

    // 2.1 Find out how many tokens the address holds
    const NFTContract = new ethers.Contract(frozenContract, ERC721_ABI, exposedEOA);
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
        const withdrawTx = await NFTContract.populateTransaction.transferFrom(exposedEOA.address, secureADDR, token, {
            nonce: scopedNonce,
            gasLimit:  await NFTContract.estimateGas.transferFrom(exposedEOA.address, secureADDR, token),
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