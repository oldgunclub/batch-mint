// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract ExampleERC20 is ERC20 {
  constructor() ERC20('E20', 'ExampleERC20') {}

  function mint(uint256 amount) external {
    _mint(msg.sender, amount);
  }
}
