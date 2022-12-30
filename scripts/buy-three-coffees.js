const { ethers, network } = require("hardhat")

const COFFEE_PRICE = 5000000000000000

async function buyCoffee() {
    const coffeeShop = await ethers.getContract("CoffeeShop")
    const tx = await coffeeShop.buyCoffee({ value: COFFEE_PRICE })
    await tx.wait(1)
    console.log("Coffee Bought!")
    const tx2 = await coffeeShop.buyCoffee({ value: COFFEE_PRICE })
    await tx2.wait(1)
    console.log("Coffee Bought!")
    const tx3 = await coffeeShop.buyCoffee({ value: COFFEE_PRICE })
    await tx3.wait(1)
    console.log("Coffee Bought!")
}

buyCoffee()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
