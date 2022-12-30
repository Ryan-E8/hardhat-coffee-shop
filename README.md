1. CoffeeShop.sol

    a. Users will interact with this contract to buy a coffee

    b. This will call a 2nd NFT contract (CoffeeNFT.sol) that will mint a coffee receipt nft to the calling wallet (This nft will only be mintable from buying through the coffee shop contract)

2. CoffeeNFT.sol

    a. This is the NFT contract, only the CoffeeShop.sol contract can call the mintNft() function (You have to buy a coffee through the Coffee Shop)

    b. This contract also includes a burn function, burn 3 tokens to get a free coffee (Hypothetically)
