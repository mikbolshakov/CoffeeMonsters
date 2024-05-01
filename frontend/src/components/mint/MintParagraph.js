import { useState, useEffect } from 'react';
import MonsterBox from '../../images/MonsterBox.svg';
import contractAbi from '../../ABI/coffeeMonstersAbi.json';
import testnetContractAbi from '../../ABI/testnetCoffeeMonstersAbi.json';
import { ethers } from 'ethers';
import './MintParagraph.css';

const mintPrice = process.env.REACT_APP_MINT_PRICE;
const halfMintPrice = process.env.REACT_APP_HALF_MINT_PRICE;

const getContract = () => {
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    contractAddress,
    testnetContractAbi,
    signer,
  );

  return contract;
};

const MintParagraph = () => {
  const [selectedOption, setSelectedOption] = useState('public');
  const [nftCount, setNftCount] = useState();
  const [price, setPrice] = useState();

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
    const contract = getContract();

    try {
      const tx = await contract.safeMint();
      await tx.wait();
      alert('Successfuly minted!');
    } catch (error) {
      alert('Blockchin side error');
      console.error(error);
    }
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
    </div>
  );
};

export default MintParagraph;
