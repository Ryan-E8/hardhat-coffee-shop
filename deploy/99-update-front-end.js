// const {
//     frontEndContractsFile,
//     frontEndContractsFile2,
//     frontEndAbiLocation,
//     frontEndAbiLocation2,
// } = require("../helper-hardhat-config")
// require("dotenv").config()
const fs = require("fs")
const { ethers, network } = require("hardhat")

const frontEndContractsFile = "../nextjs-coffee-shop/constants/networkMapping.json"
// This way it'll override the abi file any time we send it
const frontEndAbiLocation = "../nextjs-coffee-shop/constants/"

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddressesCoffeeShop()
        await updateContractAddressesCoffeeNft()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const coffeeShop = await ethers.getContract("CoffeeShop")
    fs.writeFileSync(
        `${frontEndAbiLocation}CoffeeShop.json`,
        coffeeShop.interface.format(ethers.utils.FormatTypes.json)
    )
    const coffeeNft = await ethers.getContract("CoffeeNFT")
    fs.writeFileSync(
        `${frontEndAbiLocation}CoffeeNFT.json`,
        coffeeNft.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddressesCoffeeNft() {
    const chainId = network.config.chainId.toString()
    const coffeeNFT = await ethers.getContract("CoffeeNFT")
    // Read contractAddresses in the file that are already there
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    // If the contractAddress does not exist in the file, then update it, else add it
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["CoffeeNFT"].includes(coffeeNFT.address)) {
            contractAddresses[chainId]["CoffeeNFT"].push(coffeeNFT.address)
        }
    } else {
        // Make a new entry of CoffeeNFT
        contractAddresses[chainId] = { CoffeeNFT: [coffeeNFT.address] }
    }
    // Now write it back
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

async function updateContractAddressesCoffeeShop() {
    const chainId = network.config.chainId.toString()
    const coffeeShop = await ethers.getContract("CoffeeShop")
    // Read contractAddresses in the file that are already there
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    // If the contractAddress does not exist in the file, then update it, else add it
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["CoffeeShop"].includes(coffeeShop.address)) {
            contractAddresses[chainId]["CoffeeShop"].push(coffeeShop.address)
        }
    } else {
        // Make a new entry of coffeeShop
        contractAddresses[chainId] = { CoffeeShop: [coffeeShop.address] }
    }
    // Now write it back
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
