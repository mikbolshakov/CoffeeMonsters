import { ethers } from 'hardhat';
import hre from 'hardhat';

// npx hardhat run deploy/CoffeeMonstersTestnet.ts --network taiko_hekla
async function main() {
  const _feeNumerator = 750;

  const coffee = await ethers.getContractFactory('CoffeeMonstersTestnet');
  const monsters = await coffee.deploy(_feeNumerator);

  await monsters.deployed();
  console.log(`CoffeeMonstersTestnet deployed to ${monsters.address}`);

  await new Promise((resolve) => setTimeout(resolve, 10000));

  await hre.run('verify:verify', {
    address: monsters.address,
    constructorArguments: [_feeNumerator],
    contract: 'contracts/CoffeeMonstersTestnet.sol:CoffeeMonstersTestnet',
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
