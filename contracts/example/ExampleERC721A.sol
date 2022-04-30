// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import 'erc721a/contracts/ERC721A.sol';

contract ExampleERC721A is ERC721A {
  constructor() ERC721A('E721A', 'ExampleERC721A') {}

  function mint2() external {
    _mint(msg.sender, 1, '', false);
  }
}
