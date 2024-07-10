import { ethers } from 'ethers';
import { config } from 'dotenv';
import contractAbi from '../ABI/coffeeMonstersAbi.json';
import { partnerAddresses } from '../WL/partnerAddresses';
config();

// npx ts-node scripts/3_addPartners.ts
const contractAddress = '';
const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_MAINNET);
const contract = new ethers.Contract(contractAddress, contractAbi, provider);

const admin = new ethers.Wallet(
  process.env.BASE_PRIVATE_KEY as string,
  provider,
);

export async function addPartners(admin: any, contract: ethers.Contract) {
  try {
    let tx = await contract.connect(admin).addPartners(partnerAddresses);
    await tx.wait();
    console.log(`Add success`);
  } catch (error: any) {
    console.error(`Adding error`, error);
  }
}

// addPartners(admin, contract);
