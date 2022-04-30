// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';

contract ExampleERC1155 is ERC1155 {
  constructor() ERC1155('') {}

  function mint3(uint256 id, uint256 amount) external {
    _mint(msg.sender, id, amount, '');
  }

  function mint4(uint256[] calldata ids, uint256[] calldata amounts) external {
    _mintBatch(msg.sender, ids, amounts, '');
  }
}
