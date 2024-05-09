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
        await window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then((res) => {
            console.log(res);
            return res;
          });

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
                return;
              }
            } else {
              console.log(switchError);
              return;
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('Install MetaMask extension!');
    }
  };

  const handleMint = async (e) => {
    e.preventDefault();
    const contract = getContract();

    if (nftCount === 0) {
      alert('Add some NFTs');
      return;
    }
    if (selectedOption === 'half') {
      try {
        const value = ethers.utils.parseEther(
          (halfMintPrice * nftCount).toString(),
        );
        const tx = await contract.publicMint(nftCount, false, {
          value: value,
        });
        await tx.wait();

        alert('Successfuly minted!');
      } catch (error) {
        alert('Blockchin side error');
        console.error(error);
      }
    } else {
      try {
        const value = ethers.utils.parseEther(
          (mintPrice * nftCount).toString(),
        );
        const tx = await contract.publicMint(nftCount, false, {
          value: value,
        });
        await tx.wait();
        alert('Successfuly minted!');
      } catch (error) {
        alert('Blockchin side error');
        console.error(error);
      }
    }

    setNftCount(0);
  };

  const handleTestnetMint = async () => {
    // try {
    await connectMetamaskHandler();
    // } catch (error) {
    //   return;
    // }

    const contract = getContract();

    try {
      const tx = await contract.safeMint();

      await tx.wait();
      setSuccessModalOpen(true);
    } catch (error) {
      setErrorModalOpen(true);
      console.error(error);
    }
  };

  const closeModal = () => {
    setSuccessModalOpen(false);
    setErrorModalOpen(false);
  };

  return (
    <div className="mint-container">
      <h1>Mint NFT</h1>
      {/*<div className="options-container">
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
      </div>*/}

      <div className="mint-details-container">
        <img src={MonsterBox} alt="Monster" className="monster-box" />

        {/* <div>
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
        </div> */}
      </div>
      <button className="mint-now-button" onClick={handleTestnetMint}>
        {/* Comming soon... */}
        Mint Now
      </button>

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
    </div>
  );
};

export default MintParagraph;
