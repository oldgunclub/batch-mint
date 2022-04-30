// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract ExampleERC721 is ERC721 {
  constructor() ERC721('E721', 'ExampleERC721') {}

  function mint(uint256 tokenId) external {
    _mint(msg.sender, tokenId);
  }
}
