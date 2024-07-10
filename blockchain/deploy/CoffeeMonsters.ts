import { ethers } from 'hardhat';
import hre from 'hardhat';

// npx hardhat run deploy/CoffeeMonsters.ts --network base_mainnet
async function main() {
  const _creator = '0x47d65daA4a24b60262eb3DE244f934D535776f22';
  const _developer = '0xcb0e044384Bd09f194bb82A5A7eF32C30a3d4277';
  const _designer = '0xe1b3c92c1c83e7e2ccc946fe926045c932c67d5e';
  const _royaltyReceiver = '0x1Cabc0d944b3dCCdcb6b3829A602b5ca40085f90';
  const _feeNumerator = 666;

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
