// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import '@openzeppelin/contracts/interfaces/IERC721Receiver.sol';
import '@openzeppelin/contracts/interfaces/IERC1155Receiver.sol';

import './interfaces/IWorker.sol';

contract Worker is IWorker, IERC721Receiver, IERC1155Receiver {
  address public owner;

  modifier onlyOwner {
    require(msg.sender == owner || tx.origin == owner, 'BAD_OWNER');
    _;
  }

  constructor(address _owner) payable {
    owner = _owner;
  }

  function setOwner(address _owner) external onlyOwner {
    require(_owner != address(0) && _owner != owner, 'INVALID_OWNER');
    owner = _owner;
  }

  function execTransaction(
    address payable target,
    bytes calldata input,
    uint256 value
  ) external payable onlyOwner {
    (bool succ, ) = target.call{value: value}(input);
    require(succ, 'EXEC_FAILED');
  }

  function destroy() external onlyOwner {
    selfdestruct(payable(owner));
  }

  function destroyTo(address payable recipient) external onlyOwner {
    selfdestruct(recipient);
  }

  function onERC721Received(
    address,
    address,
    uint256,
    bytes calldata
  ) external pure override returns (bytes4) {
    return IERC721Receiver.onERC721Received.selector;
  }

  function onERC1155Received(
    address,
    address,
    uint256,
    uint256,
    bytes calldata
  ) external pure override returns (bytes4) {
    return IERC1155Receiver.onERC1155Received.selector;
  }

  function onERC1155BatchReceived(
    address,
    address,
    uint256[] calldata,
    uint256[] calldata,
    bytes calldata
  ) external pure override returns (bytes4) {
    return IERC1155Receiver.onERC1155BatchReceived.selector;
  }

  function supportsInterface(bytes4) external pure override returns (bool) {
    return true;
  }

  receive() external payable {}

  fallback() external payable {}
}
