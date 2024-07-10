import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'solidity-coverage';
import dotenv from 'dotenv';
dotenv.config();

const config: HardhatUserConfig = {
  solidity: '0.8.24',

  networks: {
    taiko_hekla: {
      url: process.env.TAIKO_HEKLA as string,
      accounts: [process.env.TAIKO_PRIVATE_KEY as string],
    },
    base_mainnet: {
      url: process.env.BASE_MAINNET as string,
      accounts: [process.env.BASE_PRIVATE_KEY as string],
    },
  },
  etherscan: {
    apiKey: {
      taiko_hekla: process.env.TAIKOSCAN_API_KEY as string,
      base_mainnet: process.env.BASESCAN_API_KEY as string,
    },
    customChains: [
      {
        network: 'taiko_hekla',
        chainId: 167009,
        urls: {
          apiURL:
            'https://api.routescan.io/v2/network/testnet/evm/167009/etherscan',
          browserURL: 'https://hekla.taikoscan.network',
        },
      },
      {
        network: 'base_mainnet',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.com/api',
          browserURL: 'https://basescan.build',
        },
      },
    ],
  },
};

export default config;
