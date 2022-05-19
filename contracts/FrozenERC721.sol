//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract FrozenERC721 is ERC721 {

    address public owner;
    uint256 public tokenCounter;

    constructor(string memory name, string memory symbol) payable ERC721(name, symbol) {
        owner = msg.sender;
    }
    
    function mint() public {
        _safeMint(owner, tokenCounter);
        tokenCounter++;
    }
}