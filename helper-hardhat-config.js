const { ethers } = require("hardhat")

const networkConfig = {
    5: {
        name: "goerli",
        callbackGasLimit: "500000", // 500,000
        interval: "30", // 30 seconds
    },
    31337: {
        name: "hardhat",
        callbackGasLimit: "500000", // 500,000
        interval: "30", // 30 seconds
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}
