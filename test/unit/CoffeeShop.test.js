const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Coffee Shop Unit Tests", function () {
          let coffeeShop, coffeeShopContract, coffeeNFT, coffeeNFTContract
          const COFFEE_PRICE = 5000000000000000

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              user = accounts[1]
              await deployments.fixture(["all"])
              coffeeShopContract = await ethers.getContract("CoffeeShop")
              coffeeShop = coffeeShopContract.connect(deployer)
              coffeeNFTContract = await ethers.getContract("CoffeeNFT")
              coffeeNFT = coffeeNFTContract.connect(deployer)
              const coffeeNFTAddress = coffeeNFT.address
              await coffeeShop.setRecieptContract(coffeeNFTAddress)
          })

          describe("CoffeeShop buyCoffee", async function () {
              it("emits an event when buying a coffee", async function () {
                  expect(await coffeeShop.buyCoffee({ value: COFFEE_PRICE })).to.emit(
                      "CoffeeBought"
                  )
              })
          })
          describe("CoffeeShop withdrawMoney", async function () {
              it("only allow owner to withdraw money", async function () {
                  coffeeShop = coffeeShopContract.connect(user)
                  await expect(coffeeShop.withdrawMoney()).to.be.revertedWith(
                      "CoffeeShop__NotOwner"
                  )
              })
              it("emits an error when not sending enough eth", async function () {
                  const LESS_THAN_COFFEE_PRICE = 4000000000000000

                  await expect(
                      coffeeShop.buyCoffee({ value: LESS_THAN_COFFEE_PRICE })
                  ).to.be.revertedWith("You need to spend more ETH!")
              })
              it("withdraw money", async function () {
                  await coffeeShop.buyCoffee({ value: COFFEE_PRICE })

                  const deployerBalanceBefore = await deployer.getBalance()
                  const txResponse = await coffeeShop.withdrawMoney()
                  const transactionReceipt = await txResponse.wait(1)
                  const gasUsed = transactionReceipt.gasUsed
                  const effectiveGasPrice = transactionReceipt.effectiveGasPrice
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const deployerBalanceAfter = await deployer.getBalance()

                  assert(
                      deployerBalanceAfter.add(gasCost).toString() ==
                          deployerBalanceBefore.add(COFFEE_PRICE).toString()
                  )
              })
          })
          describe("CoffeeShop getCoffeePrice", async function () {
              it("get the coffee price", async function () {
                  const coffeePrice = await coffeeShop.getCoffeePrice()
                  assert.equal(COFFEE_PRICE, coffeePrice)
              })
          })
          describe("CoffeeNFT mint", async function () {
              it("call mint function not CoffeeShop", async function () {
                  await expect(coffeeNFT.mintNft(deployer.address)).to.be.revertedWith(
                      "CoffeeNFT__NotCoffeeShop"
                  )
              })
          })
          describe("CoffeeNFT burn", async function () {
              it("emits an event when burning tokens", async function () {
                  await coffeeShop.buyCoffee({ value: COFFEE_PRICE })
                  await coffeeShop.buyCoffee({ value: COFFEE_PRICE })
                  await coffeeShop.buyCoffee({ value: COFFEE_PRICE })

                  const tokenIds = [0, 1, 2]
                  expect(await coffeeNFT.burnTokens(tokenIds)).to.emit("NftBurned")
              })
              it("emits an error when burning tokens and not the owner", async function () {
                  await coffeeShop.buyCoffee({ value: COFFEE_PRICE })
                  await coffeeShop.buyCoffee({ value: COFFEE_PRICE })
                  await coffeeShop.buyCoffee({ value: COFFEE_PRICE })

                  const tokenIds = [0, 1, 2]
                  coffeeNFT = coffeeNFTContract.connect(user)

                  await expect(coffeeNFT.burnTokens(tokenIds)).to.be.revertedWith(
                      "CoffeeNFT: caller is not token owner or approved"
                  )
              })
          })
          describe("CoffeeNFT getTokenCounter", async function () {
              it("get the current token count", async function () {
                  await coffeeShop.buyCoffee({ value: COFFEE_PRICE })
                  const tokenCount = await coffeeNFT.getTokenCounter()
                  const expectedTokenCount = 1

                  assert.equal(tokenCount, expectedTokenCount)
              })
          })
          describe("CoffeeNFT tokenURI", async function () {
              it("get the token URI of a token", async function () {
                  await coffeeShop.buyCoffee({ value: COFFEE_PRICE })
                  const tokenURI = await coffeeNFT.tokenURI(0)
                  const URI =
                      "ipfs://QmSXVobWDAUuNgvwBKycSXFf2ZN1SXpVeH93p3TQTH1Xxs?filename=CoffeeReceipt.json"

                  assert(tokenURI == URI)
              })
          })
      })
