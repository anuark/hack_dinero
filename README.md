#FLASHBOTS     

##ERC20    

erc20 contract deployed to: 0x9e9DCd70deB5CE5e2FBfFD3bd3bb64883CFf6288        
https://goerli.etherscan.io/address/0x9e9DCd70deB5CE5e2FBfFD3bd3bb64883CFf6288#readContract

Owner/Exposed public key is: 0x3118Eb962ed7Eee7AC94883fF0a4e5Ff60d432F7


When I try to run this command `npx hardhat run scripts/ERC20/ERC20FlashBundle.js --network goerli`       
I get this error:     
```➜  hack_dinero git:(token-contracts) ✗ npx hardhat run scripts/ERC20/ERC20FlashBundle.js --network goerli

/Users/josephmarino/hack_dinero/node_modules/@ethersproject/abi/src.ts/interface.ts:102
        defineReadOnly(this, "fragments", abi.map((fragment) => {
                                              ^
TypeError: abi.map is not a function
    at new Interface (/Users/josephmarino/hack_dinero/node_modules/@ethersproject/abi/src.ts/interface.ts:102:47)
    at BaseContract.getInterface (/Users/josephmarino/hack_dinero/node_modules/@ethersproject/contracts/src.ts/index.ts:822:16)
    at Contract.BaseContract (/Users/josephmarino/hack_dinero/node_modules/@ethersproject/contracts/src.ts/index.ts:664:95)
    at new Contract (/Users/josephmarino/hack_dinero/node_modules/@ethersproject/contracts/lib/index.js:1054:42)
    at recoverFunds (/Users/josephmarino/hack_dinero/scripts/ERC20/ERC20FlashBundle.js:36:26)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)```

