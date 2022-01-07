import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import DSNFT from '../public/artifacts/DSNFT.json'

const DSNFTAddress = '0xf7acd9daf7119f6110e3f99017784f422258c57e'

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState(null)
  const [currentBalance, setCurrentBalance] = useState(null)
  const [nftMinted, setNftMinted] = useState(false)
  const [raribleLink, setRaribleLink] = useState(null)
  const [openSeaLink, setOpenSeaLink] = useState(null)

  const checkWalletIsConnected = async () => {
    const { ethereum } = window

    if (!ethereum) {
      console.log('Make sure you have Metamask installed!')
      return
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length !== 0) {
      fetchUserInfo(accounts)
    } else {
      console.log('No authorized account found')
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window

    if (!ethereum) {
      alert('Please install Metamask!')
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      fetchUserInfo(accounts)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchUserInfo = async (accounts) => {
    const account = accounts[0]
    const provider = new ethers.providers.Web3Provider(ethereum)
    const balance = await provider.getBalance('ethers.eth')

    setCurrentAccount(account)
    setCurrentBalance(ethers.utils.formatEther(balance))

    console.log('Found an authorized account: ', account)
    console.log('Current balance: ', balance)
  }

  useEffect(() => {
    checkWalletIsConnected()
    console.log(DSNFT)
  }, [])

  const mintNFT = async () => {
    if (!ethereum) {
      console.log('Make sure you have Metamask installed!')
      return
    }

    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(DSNFTAddress, DSNFT.abi, signer)

    const data = await contract.mintNFTs(1)
    console.log('data: ', data)

    setNftMinted(true)
    setRaribleLink(`https://rinkeby.rarible.com/user/${currentAccount}/owned`)
    setOpenSeaLink(
      `https://testnets.opensea.io/${currentAccount}?search[sortBy]=CREATED_DATE&search[sortAscending]=false`
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>DS NFT Walkthrough</title>
        <meta name="description" content="DS NFT Walkthrough" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>DS NFT Walkthrough</h1>

        <div className={styles.section}>
          <h2 className={styles.subTitle}>Set up MetaMask account</h2>
          <p>
            Mollit velit eu adipisicing minim irure in anim. Ipsum incididunt
            aute irure velit ipsum do aliquip commodo cillum irure dolor magna
            et. Ut eiusmod tempor eu mollit cupidatat adipisicing amet culpa
            nulla esse dolor. Duis ipsum magna pariatur veniam do eiusmod aliqua
            eiusmod pariatur et in minim. Ea magna sunt labore excepteur est. In
            qui nulla quis nostrud anim commodo occaecat est qui. Ad laboris sit
            cupidatat duis aute.
          </p>
          {!currentAccount ? (
            <button onClick={connectWalletHandler} className={styles.button}>
              Click here to connect your meta mask
            </button>
          ) : (
            <p>
              <strong>Wallet Connected:</strong> {currentAccount}
            </p>
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.subTitle}>Transfer some ETH</h2>
          <p>
            Mollit velit eu adipisicing minim irure in anim. Ipsum incididunt
            aute irure velit ipsum do aliquip commodo cillum irure dolor magna
            et. Ut eiusmod tempor eu mollit cupidatat adipisicing amet culpa
            nulla esse dolor. Duis ipsum magna pariatur veniam do eiusmod aliqua
            eiusmod pariatur et in minim. Ea magna sunt labore excepteur est. In
            qui nulla quis nostrud anim commodo occaecat est qui. Ad laboris sit
            cupidatat duis aute.
          </p>
          {currentBalance && (
            <p>
              <strong>Current Balance (ETH):</strong> {currentBalance}
            </p>
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.subTitle}>Mint an NFT</h2>
          <p>
            Mollit velit eu adipisicing minim irure in anim. Ipsum incididunt
            aute irure velit ipsum do aliquip commodo cillum irure dolor magna
            et. Ut eiusmod tempor eu mollit cupidatat adipisicing amet culpa
            nulla esse dolor. Duis ipsum magna pariatur veniam do eiusmod aliqua
            eiusmod pariatur et in minim. Ea magna sunt labore excepteur est. In
            qui nulla quis nostrud anim commodo occaecat est qui. Ad laboris sit
            cupidatat duis aute.
          </p>
          {nftMinted ? (
            <p>NFT Succesfully Minted!</p>
          ) : (
            <button onClick={mintNFT} className={styles.button}>
              Click here to mint your first NFT
            </button>
          )}
          {openSeaLink && (
            <p>
              <a href={openSeaLink} target="_blank" rel="noreferrer">
                View your NFT on OpenSea
              </a>
              .
            </p>
          )}
          {raribleLink && (
            <p>
              <a href={raribleLink} target="_blank" rel="noreferrer">
                View your NFT on Rarible
              </a>
              .
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
