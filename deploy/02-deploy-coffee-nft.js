const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const coffeeShop = await ethers.getContract("CoffeeShop")
    const coffeeShopAddress = coffeeShop.address

    log("----------------------------------------------------")

    arguments = [coffeeShopAddress]
    const coffeeNft = await deploy("CoffeeNFT", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Setting the CoffeeNFT address in the Coffee Shop contract
    const coffeeNFTAddress = coffeeNft.address
    await coffeeShop.setRecieptContract(coffeeNFTAddress)
    log("Set Reciept Contract address!")

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(coffeeNft.address, arguments)
    }
}

module.exports.tags = ["all", "coffeenft", "main"]
