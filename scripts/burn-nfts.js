const { ethers, network } = require("hardhat")

const tokenIds = [0, 1, 2]

async function burnNfts() {
    const coffeeNFT = await ethers.getContract("CoffeeNFT")
    const tx = await coffeeNFT.burnTokens(tokenIds)
    const txReceipt = await tx.wait(1)
    console.log(
        `Burned token ID's ${txReceipt.events[0].args.tokenId.toString()} ${txReceipt.events[3].args.tokenId.toString()} ${txReceipt.events[6].args.tokenId.toString()} from contract: ${
            coffeeNFT.address
        }`
    )
}

burnNfts()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
