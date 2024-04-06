import { ethers } from 'hardhat';
import hre from 'hardhat';

// npx hardhat run deploy/CoffeeMonsters.ts --network linea_goerli
async function main() {
  const _creator = '0x6ae19a226A6Cec3E29D5dfC90C2bd6640d8d77b9';
  const _developer = '0x6ae19a226A6Cec3E29D5dfC90C2bd6640d8d77b9';
  const _designer = '0x6ae19a226A6Cec3E29D5dfC90C2bd6640d8d77b9';
  const _royaltyReceiver = '0x6ae19a226A6Cec3E29D5dfC90C2bd6640d8d77b9';
  const _feeNumerator = 1000;

  const coffee = await ethers.getContractFactory('CoffeeMonsters');
  const monsters = await coffee.deploy(
    _creator,
    _developer,
    _designer,
    _royaltyReceiver,
    _feeNumerator,
  );

  await monsters.deployed();
  console.log(`CoffeeMonsters deployed to ${monsters.address}`);

  await new Promise((resolve) => setTimeout(resolve, 10000));

  await hre.run('verify:verify', {
    address: monsters.address,
    constructorArguments: [
      _creator,
      _developer,
      _designer,
      _royaltyReceiver,
      _feeNumerator,
    ],
    contract: 'contracts/CoffeeMonsters.sol:CoffeeMonsters',
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
