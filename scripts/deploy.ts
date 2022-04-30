import { ethers, upgrades } from 'hardhat'

async function main() {
  const Factory = await ethers.getContractFactory('BatchMintFactory')
  const factory = await upgrades.deployProxy(Factory)
  await factory.deployed()
  console.log('BatchMintFactory deployed to:', factory.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
