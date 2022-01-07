const { utils } = require('ethers')

async function main() {
  const baseTokenURI = 'ipfs://QmeU7KV22ZoJbnDW98eWbP2X22smLPBwe1y2gu4bRT9Cse/'

  // Get owner/deployer's wallet address
  const [owner] = await hre.ethers.getSigners()

  // Get contract that we want to deploy
  const contractFactory = await hre.ethers.getContractFactory('DSNFT')

  // Deploy contract with the correct constructor arguments
  const contract = await contractFactory.deploy(baseTokenURI)

  // Wait for this transaction to be mined
  await contract.deployed()

  // Get contract address
  console.log('Contract deployed to:', contract.address)

  // Reserve NFTs
  let txn = await contract.reserveNFTs()
  await txn.wait()
  console.log('1 NFT has been reserved')

  // Mint 3 NFTs by sending 0.03 ether
  txn = await contract.mintNFTs(1)
  await txn.wait()

  // Get all token IDs of the owner
  let tokens = await contract.tokensOfOwner(owner.address)
  console.log('Owner has tokens: ', tokens)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })