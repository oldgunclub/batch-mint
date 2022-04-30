// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Worker.sol';

contract Factory {
//  address target;
//  Worker[] public worker;
//
//  constructor(address _target) {
//    target = _target;
//  }
//
//  function create(uint256 _value) external payable {
//    Worker _worker = new Worker{value: _value}(target);
//    worker.push(_worker);
//  }
//
//  function createBatch(uint256 _num, uint256 _value) external payable onlyOwner {
//    require(msg.value >= _value * _num, 'Not enough eth to pay');
//    for (uint256 i = 0; i < _num; i++) {
//      this.create(_value);
//    }
//  }
//
//  function batchMint() external onlyOwner {
//    for (uint256 i = 0; i < worker.length; i++) {
//      worker[i].mint();
//    }
//  }
//
//  function batchWithdrawAll(address recipient) external onlyOwner {
//    for (uint256 i = 0; i < worker.length; i++) {
//      worker[i].withdraw(recipient);
//      worker[i].withdrawNFT(recipient);
//    }
//  }
//
//  function batchWithdraw(address recipient) external onlyOwner {
//    for (uint256 i = 0; i < worker.length; i++) {
//      worker[i].withdraw(recipient);
//    }
//  }
//
//  function batchWithdrawNFT(address recipient) external onlyOwner {
//    for (uint256 i = 0; i < worker.length; i++) {
//      worker[i].withdrawNFT(recipient);
//    }
//  }
//
//  function withdrawNFTById(
//    address _worker,
//    address recipient,
//    uint256 id
//  ) external onlyOwner {
//    Worker(_worker).withdrawNFTById(recipient, id);
//  }
}
