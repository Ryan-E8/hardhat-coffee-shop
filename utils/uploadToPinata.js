const pinataSDK = require("@pinata/sdk")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

const pinataApiKey = process.env.PINATA_API_KEY || ""
const pinataApiSecret = process.env.PINATA_API_SECRET || ""
const pinata = pinataSDK(pinataApiKey, pinataApiSecret)

async function storeImages(imagesFilePath) {
    // This gets the full images path
    const fullImagesPath = path.resolve(imagesFilePath)
    // This will read the entire directory and get our files
    const files = fs.readdirSync(fullImagesPath)
    // For responses from the Pinata server
    let responses = []
    console.log("Uploading to Pinata!")
    for (fileIndex in files) {
        console.log(`Working on ${fileIndex}...`)
        // Creating a read stream for each file
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`)
        try {
            // pinFileToIPFS takes a readstream
            const response = await pinata.pinFileToIPFS(readableStreamForFile)
            // Push the response onto our array
            responses.push(response)
        } catch (error) {
            console.log(error)
        }
    }
    // Return the responses from pushing the files and the files
    return { responses, files }
}

async function storeTokeUriMetadata(metadata) {
    try {
        // We are calling this in our deploy script after we have created the metadata, this will store it to pinata / IPFS
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (error) {
        console.log(error)
    }
    return null
}

module.exports = { storeImages, storeTokeUriMetadata }
