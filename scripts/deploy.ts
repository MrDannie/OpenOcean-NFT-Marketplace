import { ethers } from 'hardhat'

async function main() {
    const NFTMarket = await ethers.getContractFactory('NFTMarket')
    const nftMarket = await NFTMarket.deploy()
    await nftMarket.deployed()
    console.log('DEPLOYED TO:', nftMarket.address)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
