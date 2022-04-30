import { expect } from 'chai'
import { ethers, upgrades } from 'hardhat'

const iface = new ethers.utils.Interface([
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function transferFrom(address from, address to, uint256 tokenId) external',
  'function transferFrom(address from, address to, uint256 tokenId) external',
  'function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public',
  'function safeBatchTransferFrom(address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public',
  'function mint(uint256 tokenId) external',
  'function mint2() external',
  'function mint3(uint256 id, uint256 amount) external',
  'function mint4(uint256[] calldata ids, uint256[] calldata amounts) external',
])

describe('Factory', function () {
  it("Should return the new greeting once it's changed", async function () {
    const Factory = await ethers.getContractFactory('Factory')
    const factory = await upgrades.deployProxy(Factory)
    await factory.deployed()
    console.log('BatchMintFactory deployed to:', factory.address)
  })
})

describe('Worker', function () {
  it('Withdraw', async function () {
    const accounts = await ethers.getSigners()
    const owner = accounts[0]

    const value = ethers.utils.parseEther('1')

    // 带资金部署
    const Worker = await ethers.getContractFactory('Worker')
    const worker = await Worker.deploy(owner.address, { value })
    await worker.deployed()
    expect(await worker.provider.getBalance(worker.address)).to.equal(value)

    // 额外存入资金
    await owner.sendTransaction({ to: worker.address, value })
    expect(await worker.provider.getBalance(worker.address)).to.equal(value.mul(2))

    // 提取资金
    const receiver = accounts[1]
    let beforeBalance = await receiver.getBalance()
    await worker.execTransaction(receiver.address, '0x', value)
    expect(await receiver.getBalance()).to.equal(beforeBalance.add(value))
    expect(await worker.provider.getBalance(worker.address)).to.equal(value)

    // 销毁合约
    beforeBalance = await receiver.getBalance()
    await worker.destroyTo(receiver.address)
    expect(await receiver.getBalance()).to.equal(beforeBalance.add(value))
    expect(await worker.provider.getBalance(worker.address)).to.equal(0)
  })

  it('ERC20', async function () {
    const accounts = await ethers.getSigners()
    const owner = accounts[0]

    const Worker = await ethers.getContractFactory('Worker')
    const worker = await Worker.deploy(owner.address)
    await worker.deployed()

    const ERC20 = await ethers.getContractFactory('ExampleERC20')
    const erc20 = await ERC20.deploy()
    await erc20.deployed()

    // owner mint
    const value = ethers.utils.parseEther('1')
    await erc20.mint(value)
    expect(await erc20.balanceOf(owner.address)).to.equal(value)

    // 向 worker 存入 erc20 代币
    await erc20.transfer(worker.address, value)
    expect(await erc20.balanceOf(owner.address)).to.equal(0)
    expect(await erc20.balanceOf(worker.address)).to.equal(value)

    // withdraw erc20
    const receiver = accounts[1]
    await worker.execTransaction(
      erc20.address,
      iface.encodeFunctionData('transfer', [receiver.address, value]),
      0,
    )
    expect(await erc20.balanceOf(worker.address)).to.equal(0)
    expect(await erc20.balanceOf(receiver.address)).to.equal(value)
  })

  it('ERC721', async function () {
    const accounts = await ethers.getSigners()
    const owner = accounts[0]

    const Worker = await ethers.getContractFactory('Worker')
    const worker = await Worker.deploy(owner.address)
    await worker.deployed()

    const ERC721 = await ethers.getContractFactory('ExampleERC721')
    const erc721 = await ERC721.deploy()
    await erc721.deployed()

    const tokenId1 = 0
    await erc721.mint(tokenId1)
    expect(await erc721.ownerOf(tokenId1)).to.equal(owner.address)

    await erc721.transferFrom(owner.address, worker.address, tokenId1)
    expect(await erc721.ownerOf(tokenId1)).to.equal(worker.address)

    const tokenId2 = 1
    await worker.execTransaction(erc721.address, iface.encodeFunctionData('mint', [tokenId2]), 0)
    expect(await erc721.ownerOf(tokenId2)).to.equal(worker.address)
    expect(await erc721.balanceOf(worker.address)).to.equal(2)

    // withdraw nft
    await worker.execTransaction(
      erc721.address,
      iface.encodeFunctionData('transferFrom', [worker.address, owner.address, tokenId1]),
      0,
    )
    expect(await erc721.ownerOf(tokenId1)).to.equal(owner.address)
    await worker.execTransaction(
      erc721.address,
      iface.encodeFunctionData('transferFrom', [worker.address, owner.address, tokenId2]),
      0,
    )
    expect(await erc721.ownerOf(tokenId2)).to.equal(owner.address)
    expect(await erc721.balanceOf(worker.address)).to.equal(0)
    expect(await erc721.balanceOf(owner.address)).to.equal(2)
  })

  it('ERC721A', async function () {
    const accounts = await ethers.getSigners()
    const owner = accounts[0]

    const Worker = await ethers.getContractFactory('Worker')
    const worker = await Worker.deploy(owner.address)
    await worker.deployed()

    const ERC721A = await ethers.getContractFactory('ExampleERC721A')
    const erc721a = await ERC721A.deploy()
    await erc721a.deployed()

    const tokenId1 = 0
    await erc721a.mint2()
    expect(await erc721a.ownerOf(tokenId1)).to.equal(owner.address)

    await erc721a.transferFrom(owner.address, worker.address, tokenId1)
    expect(await erc721a.ownerOf(tokenId1)).to.equal(worker.address)

    const tokenId2 = 1
    await worker.execTransaction(erc721a.address, iface.encodeFunctionData('mint2'), 0)
    expect(await erc721a.ownerOf(tokenId2)).to.equal(worker.address)
    expect(await erc721a.balanceOf(worker.address)).to.equal(2)

    // withdraw nft
    await worker.execTransaction(
      erc721a.address,
      iface.encodeFunctionData('transferFrom', [worker.address, owner.address, tokenId1]),
      0,
    )
    expect(await erc721a.ownerOf(tokenId1)).to.equal(owner.address)
    await worker.execTransaction(
      erc721a.address,
      iface.encodeFunctionData('transferFrom', [worker.address, owner.address, tokenId2]),
      0,
    )
    expect(await erc721a.ownerOf(tokenId2)).to.equal(owner.address)
    expect(await erc721a.balanceOf(worker.address)).to.equal(0)
    expect(await erc721a.balanceOf(owner.address)).to.equal(2)
  })

  it('ERC1155', async function () {
    const accounts = await ethers.getSigners()
    const owner = accounts[0]

    const Worker = await ethers.getContractFactory('Worker')
    const worker = await Worker.deploy(owner.address)
    await worker.deployed()

    const ERC1155 = await ethers.getContractFactory('ExampleERC1155')
    const erc1155 = await ERC1155.deploy()
    await erc1155.deployed()

    const tokenId = 0
    await erc1155.mint3(tokenId, 1)
    expect(await erc1155.balanceOf(owner.address, tokenId)).to.equal(1)

    await erc1155.safeTransferFrom(owner.address, worker.address, tokenId, 1, '0x')
    expect(await erc1155.balanceOf(owner.address, tokenId)).to.equal(0)
    expect(await erc1155.balanceOf(worker.address, tokenId)).to.equal(1)

    await worker.execTransaction(
      erc1155.address,
      iface.encodeFunctionData('mint3', [tokenId, 1]),
      0,
    )
    expect(await erc1155.balanceOf(worker.address, tokenId)).to.equal(2)
    await worker.execTransaction(
      erc1155.address,
      iface.encodeFunctionData('mint4', [[tokenId], [1]]),
      0,
    )
    expect(await erc1155.balanceOf(worker.address, tokenId)).to.equal(3)

    // withdraw nft
    await worker.execTransaction(
      erc1155.address,
      iface.encodeFunctionData('safeTransferFrom', [
        worker.address,
        owner.address,
        tokenId,
        1,
        '0x',
      ]),
      0,
    )
    expect(await erc1155.balanceOf(owner.address, tokenId)).to.equal(1)
    expect(await erc1155.balanceOf(worker.address, tokenId)).to.equal(2)
    await worker.execTransaction(
      erc1155.address,
      iface.encodeFunctionData('safeBatchTransferFrom', [
        worker.address,
        owner.address,
        [tokenId],
        [2],
        '0x',
      ]),
      0,
    )
    expect(await erc1155.balanceOf(owner.address, tokenId)).to.equal(3)
    expect(await erc1155.balanceOf(worker.address, tokenId)).to.equal(0)
  })
})
