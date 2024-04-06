import React, { useState, useEffect } from 'react';
import MonsterBox from '../../images/MonsterBox.svg';
import CheckBox from '../../images/CheckBox.svg';
import CheckMark from '../../images/CheckMark.svg';
import './MintParagraph.css';
// import { ethers } from "ethers";
// import contractAbi from "../ABI/contractAbi.json";
// import axios from "axios";

// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const signer = provider.getSigner();
// const contract = new ethers.Contract(contractAddress, contractAbi, signer);

const MintParagraph = () => {
  const [selectedOption, setSelectedOption] = useState('public');
  const [nftCount, setNftCount] = useState(0);
  const [emailVisible, setEmailVisible] = useState(false);
  const [upgradedPrice, setUpgradedPrice] = useState(false);
  const [currentArrow, setCurrentArrow] = useState(CheckBox);
  const [price, setPrice] = useState('0 ETH');
  const [email, setEmail] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    setNftCount(0);
    setEmailVisible(false);
    setUpgradedPrice(false);
    setCurrentArrow(CheckBox);
  }, [selectedOption]);

  useEffect(() => {
    let price;
    if (selectedOption === 'free') {
      price = 'Free';
    } else if (selectedOption === 'half') {
      price = (0.00333 * nftCount).toFixed(5) + ' ETH';
    } else {
      price = upgradedPrice
        ? (0.0666 * nftCount).toFixed(5) + ' ETH'
        : (0.00666 * nftCount).toFixed(5) + ' ETH';
    }
    setPrice(price);
  }, [selectedOption, upgradedPrice, nftCount]);

  const handleMerchImageChange = () => {
    if (currentArrow === CheckBox) {
      setEmailVisible(true);
      setUpgradedPrice(true);
      setCurrentArrow(CheckMark);
    } else {
      setEmailVisible(false);
      setUpgradedPrice(false);
      setCurrentArrow(CheckBox);
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleDecreaseNftCount = () => {
    if (nftCount > 0) {
      setNftCount(nftCount - 1);
    }
  };

  const handleIncreaseNftCount = () => {
    if (nftCount < 10) {
      setNftCount(nftCount + 1);
    }
  };

  const validateForm = () => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  //   const handleMint = async (e) => {
  //     e.preventDefault();
  //     let receipt;

  //     if (selectedOption === "public") {
  //       if (emailVisible) {
  //         if (validateForm()) {
  //           try {
  //             const value = ethers.utils.parseEther(
  //               (0.1 * nftCount).toFixed(5)
  //             );
  //             const tx = await contract.publicMint(nftCount, true, {
  //               value: value,
  //             });
  //             receipt = await tx.wait();
  //           } catch (error) {
  //             alert("Limitation in a smart contract");
  //             console.error(error);
  //           }

  //           if (receipt.status === 1) {
  //             try {
  //               await axios.post("http://localhost:5555/collectors", {
  //                 email: email,
  //               });
  //               setNftCount(0);
  //               setEmailVisible(false);
  //               setUpgradedPrice(false);
  //               setCurrentArrow(CheckBox);
  //             } catch (error) {
  //               alert("Database limitation");
  //               console.error(error);
  //             }
  //             alert("Successful minting!");
  //           }
  //         } else {
  //           console.log("Error when executing a transaction on a smart contract");
  //         }
  //       } else {
  //         try {
  //           const value = ethers.utils.parseEther((0.01 * nftCount).toFixed(5));
  //           const tx = await contract.publicMint(nftCount, false, {
  //             value: value,
  //           });
  //           await tx.wait();
  //           alert("Successful minting!");
  //         } catch (error) {
  //           alert("Limitation in a smart contract");
  //           console.error(error);
  //         }
  //       }
  //     } else if (selectedOption === "half") {
  //       try {
  //         const tx = await contract.mintForPartners(nftCount);
  //         await tx.wait();
  //         alert("Successful minting!");
  //       } catch (error) {
  //         alert("Limitation in a smart contract");
  //         console.error(error);
  //       }
  //     } else if (selectedOption === "free") {
  //       try {
  //         const tx = await contract.freeMint(nftCount);
  //         await tx.wait();
  //         alert("Successful minting!");
  //       } catch (error) {
  //         alert("Limitation in a smart contract");
  //         console.error(error);
  //       }
  //     }

  //     setNftCount(0);
  //     setEmailVisible(false);
  //     setUpgradedPrice(false);
  //     setCurrentArrow(CheckBox);
  //   };

  //   const connectMetamaskHandler = async () => {
  //     if (window.ethereum) {
  //       try {
  //         const accounts = await window.ethereum
  //           .request({ method: "eth_requestAccounts" })
  //           .then((res) => {
  //             console.log(res);
  //             return res;
  //           });

  //         if (accounts.length > 0) {
  //           setWalletAddress(accounts[0]);
  //           sendWalletAddress(accounts[0]);
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     } else {
  //       alert("Install MetaMask extension!");
  //     }
  //   };

  //   const sendWalletAddress = async (address) => {
  //     try {
  //       await axios.post("http://localhost:5555/wlcollectors", {
  //         walletAddress: address,
  //       });
  //       alert("Wallet address added to WL");
  //     } catch (error) {
  //       alert("This wallet is already in WL");
  //       console.error(error);
  //     }
  //   };

  //   useEffect(() => {
  //     connectMetamaskHandler();
  //   }, []);

  //   const WL = async () => {
  //     try {
  //         await axios.post("http://localhost:5555/wlcollectors", {
  //           walletAddress: walletAddress,
  //         });
  //         alert("Wallet address added to WL");
  //       } catch (error) {
  //         alert("This wallet is already in WL");
  //         console.error(error);
  //       }
  //   }

  return (
    <div className="mint-container">
      {/* <button onClick={WL}>WL</button> */}
      <h1>Mint NFT</h1>
      <div className="options-container">
        <div
          className={`option ${selectedOption === 'public' ? 'selected' : ''}`}
          onClick={() => handleOptionChange('public')}
        >
          Public Mint
        </div>
        <div
          className={`option ${selectedOption === 'half' ? 'selected' : ''}`}
          onClick={() => handleOptionChange('half')}
        >
          50% Mint
          <div className="info-button">
            ?
            <span className="info-text">
              Users with NFTs from the following collections (Proof of Narnian,
              LobsterDao, DegenScore, Harma) enjoy a 50% minting price.
            </span>
          </div>
        </div>
        <div
          className={`option ${selectedOption === 'free' ? 'selected' : ''}`}
          onClick={() => handleOptionChange('free')}
        >
          Free Mint
          <div className="info-button">
            ?
            <span className="info-text1">
              The CoffeeMonsters pass holder has the exclusive privilege of free
              minting opportunity.
            </span>
          </div>
        </div>
        <div className={`underline ${selectedOption}`} />
      </div>

      <div className="details-container">
        <div className="details-left">
          <img src={MonsterBox} alt="Monster" className="monster-image" />
        </div>

        <div className="details-right">
          <div className="detail-column">
            <div className="detail-row">
              <div className="detail-label">Price</div>
              <div className="detail-value">{price}</div>
            </div>
          </div>

          <div className="detail-column">
            <div className="detail-row">
              <div className="detail-label">Max Mint Per Wallet</div>
              <div className="detail-value">10</div>
            </div>
          </div>

          <div className="detail-column">
            <div className="detail-row">
              <div className="detail-label">Number</div>
              <div className="number-buttons">
                <button onClick={handleDecreaseNftCount}>-</button>
                <span>{nftCount}</span>
                <button onClick={handleIncreaseNftCount}>+</button>
              </div>
            </div>
          </div>

          {selectedOption === 'public' && (
            <div className="detail-column">
              <div className="detail-row">
                <div className="detail-label">
                  Merch
                  <div className="info-button">
                    ?
                    <span className="info-text2">
                      When minting NFTs with merchandise, please provide your
                      valid mailing address. We'll reach out to confirm your
                      size and delivery date, ensuring a seamless experience.
                    </span>
                  </div>
                </div>

                <div className="merch-buttons">
                  <div className="merch-container">
                    {emailVisible && (
                      <input
                        type="email"
                        placeholder="leave us your email"
                        value={email}
                        onChange={handleEmailChange}
                      />
                    )}
                    <img
                      src={currentArrow}
                      alt="Merch"
                      onClick={handleMerchImageChange}
                    />
                  </div>
                </div>
              </div>

              <div className="merch-description">
                Add the official Coffee Monsters merch
              </div>
            </div>
          )}
        </div>
      </div>
      <button className="mint-now-button">
        {/* onClick={handleMint}> */}
        Mint Now
      </button>
    </div>
  );
};

export default MintParagraph;
