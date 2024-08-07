import { useState } from 'react';
import './ConnectButton.css';

const ConnectButton = () => {
  const [metaMaskConnected, setMetaMaskConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const shortAddress = (address) => {
    return address ? address.substr(0, 6) + '...' + address.substr(-5) : '';
  };

  const disconnectWalletHandler = () => {
    if (window.ethereum) {
      try {
        if (typeof window.ethereum.disconnect === 'function') {
          window.ethereum.disconnect();
        }

        setMetaMaskConnected(false);
        setWalletAddress('');
      } catch (error) {
        console.log(error);
      }
    }
  };

  const connectMetamaskHandler = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then((res) => {
            console.log(res);
            return res;
          });

        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }

        const currentChainId = await window.ethereum.request({
          method: 'eth_chainId',
        });

        if (currentChainId !== '0x2105') {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x2105' }],
            });
          } catch (switchError) {
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: '0x2105',
                      chainName: 'Base Mainnet',
                      rpcUrls: ['https://mainnet.base.org'],
                      nativeCurrency: {
                        name: 'ETH',
                        symbol: 'ETH',
                        decimals: 18,
                      },
                      blockExplorerUrls: ['https://basescan.org'],
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

        setMetaMaskConnected(true);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('Install MetaMask extension!');
    }
  };

  return (
    <>
      {metaMaskConnected ? (
        <button className="connect-button" onClick={disconnectWalletHandler}>
          {shortAddress(walletAddress)}
        </button>
      ) : (
        <button className="connect-button" onClick={connectMetamaskHandler}>
          Connect MetaMask
        </button>
      )}
    </>
  );
};

export default ConnectButton;
