import { ethers } from 'ethers';
import { config } from 'dotenv';
import contractAbi from '../ABI/coffeeMonstersAbi.json';
import { freeMintAddresses } from '../WL/freeMintAddresses';
config();

// npx ts-node scripts/2_freeMint.ts
const contractAddress = '0xDaf131eb30748F4E204D42537E54E4C0B305F0D4';
const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_MAINNET);
const contract = new ethers.Contract(contractAddress, contractAbi, provider);

const admin = new ethers.Wallet(
  process.env.BASE_PRIVATE_KEY as string,
  provider,
);

export async function mintNFTs(admin: any, contract: ethers.Contract) {
  for (let i = 0; i < freeMintAddresses.length; i++) {
    const address = freeMintAddresses[i];
    try {
      let tx = await contract.connect(admin).mint(address);
      await tx.wait();
      console.log(`Mint success ${i + 1}: ${address}`);
    } catch (error: any) {
      console.error(`Minting error ${i + 1}: ${address}`, error);
    }
  }
}

mintNFTs(admin, contract);
