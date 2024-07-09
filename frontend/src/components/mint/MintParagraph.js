import { useState, useEffect } from 'react';
import MonsterBox from '../../images/MonsterBox.svg';
import contractAbi from '../../ABI/coffeeMonstersAbi.json';
import testnetContractAbi from '../../ABI/testnetCoffeeMonstersAbi.json';
import { ethers } from 'ethers';
import './MintParagraph.css';

const mintPrice = process.env.REACT_APP_MINT_PRICE;
const halfMintPrice = process.env.REACT_APP_HALF_MINT_PRICE;

const getContract = () => {
  try {
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      testnetContractAbi,
      signer,
    );

    return contract;
  } catch (error) {
    console.log(error.message);
  }
};

const MintParagraph = () => {
  const [selectedOption, setSelectedOption] = useState('public');
  const [nftCount, setNftCount] = useState();
  const [price, setPrice] = useState();
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [addNftsModalOpen, setAddNftsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNftCount(0);
  }, [selectedOption]);

  useEffect(() => {
    let price;
    if (selectedOption === 'half') {
      price = (halfMintPrice * nftCount).toFixed(5) + ' ETH';
    } else {
      price = (mintPrice * nftCount).toFixed(5) + ' ETH';
    }
    setPrice(price);
  }, [selectedOption, nftCount]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleDecreaseNftCount = () => {
    if (nftCount > 0) {
      setNftCount(nftCount - 1);
    }
  };

  const handleIncreaseNftCount = () => {
    if (nftCount < 100) {
      setNftCount(nftCount + 1);
    }
  };

  const connectMetamaskHandler = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const currentChainId = await window.ethereum.request({
          method: 'eth_chainId',
        });

        if (currentChainId !== '0x28c61') {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x28c61' }],
            });
          } catch (switchError) {
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: '0x28c61',
                      chainName: 'Taiko Hekla L2',
                      rpcUrls: ['https://rpc.hekla.taiko.xyz'],
                      nativeCurrency: {
                        name: 'ETH',
                        symbol: 'ETH',
                        decimals: 18,
                      },
                      blockExplorerUrls: ['https://hekla.taikoscan.network'],
                    },
                  ],
                });
              } catch (addError) {
                console.log(addError);
                return false;
              }
            } else {
              console.log(switchError);
              return false;
            }
          }
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    } else {
      alert('Install MetaMask extension!');
      return false;
    }
  };

  const handleMint = async (e) => {
    e.preventDefault();

    const isConnected = await connectMetamaskHandler();

    if (!isConnected) {
      return;
    }

    const contract = getContract();

    if (nftCount === 0) {
      setAddNftsModalOpen(true);
      return;
    }

    if (selectedOption === 'half') {
      try {
        const value = ethers.utils.parseEther(
          (halfMintPrice * nftCount).toString(),
        );

        setLoading(true);
        const tx = await contract.publicMint(nftCount, false, {
          value: value,
        });
        await tx.wait();

        setSuccessModalOpen(true);
      } catch (error) {
        setErrorModalOpen(true);
        console.error(error);
      }
    } else {
      try {
        const value = ethers.utils.parseEther(
          (mintPrice * nftCount).toString(),
        );

        setLoading(true);
        const tx = await contract.publicMint(nftCount, false, {
          value: value,
        });
        await tx.wait();

        setSuccessModalOpen(true);
      } catch (error) {
        setErrorModalOpen(true);
        console.error(error);
      }
    }

    setLoading(false);
    setNftCount(0);
  };

  const handleTestnetMint = async () => {
    const isConnected = await connectMetamaskHandler();

    if (!isConnected) {
      return;
    }

    const contract = getContract();

    try {
      setLoading(true);
      const tx = await contract.safeMint();
      await tx.wait();

      setSuccessModalOpen(true);
    } catch (error) {
      console.error(error);
      setErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSuccessModalOpen(false);
    setErrorModalOpen(false);
  };

  return (
    <div className="mint-container">
      <h1>Mint NFT</h1>
      <div className="options-container">
        <div className={'option'} onClick={() => handleOptionChange('public')}>
          Public Mint
        </div>
        <div className={'option'} onClick={() => handleOptionChange('half')}>
          50% Mint
          <div className="info-button">
            ?
            <span className="info-text">
              Users with NFTs from the following collections (Proof of Narnian,
              LobsterDao, DegenScore, Harma) enjoy a 50% minting price.
            </span>
          </div>
        </div>
        <div className={`underline ${selectedOption}`} />
      </div>

      <div className="mint-details-container">
        <img src={MonsterBox} alt="Monster" className="monster-box" />

        <div>
          <div className="detail-column">
            <div className="detail-row">
              <p>Number</p>
              <div className="number-buttons">
                <button onClick={handleDecreaseNftCount}>-</button>
                <span>{nftCount}</span>
                <button onClick={handleIncreaseNftCount}>+</button>
              </div>
            </div>
          </div>

          <div className="detail-row">
            <p>Total price</p>
            <p>{price}</p>
          </div>
        </div>
      </div>
      <button className="mint-now-button" onClick={handleTestnetMint}>
        {/* Comming soon... */}
        Mint Now
      </button>

      {loading && (
        <div className="loader-overlay">
          <p className="loading-text">Waiting for transaction...</p>
          <div className="loader"></div>
        </div>
      )}

      {successModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Roar!</h2>
            <p>Successfully minted!</p>
            <button onClick={closeModal}>OK</button>
          </div>
        </div>
      )}

      {errorModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Oh no!</h2>
            <p>Blockchain side error</p>
            <button onClick={closeModal}>OK</button>
          </div>
        </div>
      )}

      {addNftsModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Oh no!</h2>
            <p>Add some NFTs</p>
            <button onClick={closeModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MintParagraph;
