const { network } = require("hardhat")

function sleep(timeInMs) {
    // In order for us to wait for some time, we have to use Promise's
    // To sleep in javascript, we return a new promise and we call the setTimeout function which waits the time in milliseconds
    return new Promise((resolve) => setTimeout(resolve, timeInMs))
}

// amount = the amount of blocks to mine, sleppAmount is an optional parameter
// If we want to move blocks and then sleep a second between blocks to resemble a real blockchain we can do that too
async function moveBlocks(amount, sleepAmount = 0) {
    console.log("Moving blocks...")
    for (let index = 0; index < amount; index++) {
        // This is a raw call to our blockchain, specifically evm_mine for this
        await network.provider.request({
            method: "evm_mine",
            params: [],
        })
        // if sleepAmount > 0
        if (sleepAmount) {
            console.log(`Sleeping for ${sleepAmount}`)
            await sleep(sleepAmount)
        }
    }
    console.log(`Moved ${amount} blocks`)
}

module.exports = {
    moveBlocks,
    sleep,
}
