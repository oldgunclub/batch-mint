// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IWorker {
  function setOwner(address owner) external;

  function execTransaction(
    address payable target,
    bytes calldata input,
    uint256 value
  ) external payable;

  function destroy() external;

  function destroyTo(address payable recipient) external;
}
