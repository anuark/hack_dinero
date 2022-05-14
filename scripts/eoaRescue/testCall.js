require("dotenv").config();
const ethers = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL);

const contract = "0x429b1DadA1A851018dCa555C12fFC96a7815b566";
const eoa = new ethers.Wallet(process.env.EXPOSED_PK, provider);
const abi = ["function read() public"]

const c = new ethers.Contract(contract, abi, eoa);


async function test() {
    const tx = await c.read();
    await tx.wait()
    console.log(tx);
}

test();