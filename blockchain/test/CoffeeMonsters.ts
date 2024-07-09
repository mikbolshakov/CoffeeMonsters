import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { CoffeeMonsters } from '../typechain-types';
import { freeMintAddresses } from '../WL/freeMint';
import { fiftyPercents } from '../WL/fiftyPercents';

describe('CoffeeMonsters tests', async () => {
  let nftContract: CoffeeMonsters;
  let signers: SignerWithAddress[];
  let creator: SignerWithAddress;
  let developer: SignerWithAddress;
  let designer: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let user4: SignerWithAddress;

  const freeMintAmount = 84;
  before(async () => {
    signers = await ethers.getSigners();
    creator = signers[0];
    developer = signers[1];
    designer = signers[2];
    user1 = signers[3];
    user2 = signers[4];
    user3 = signers[5];
    user4 = signers[6];
  });

  it('Deploy contract', async () => {
    const Factory = await ethers.getContractFactory('CoffeeMonsters');
    const monsters = await Factory.deploy(
      creator.address,
      developer.address,
      designer.address,
      creator.address,
      1000,
      freeMintAddresses,
      fiftyPercents,
    );

    expect(monsters.address).to.not.eq(ethers.constants.AddressZero);
    nftContract = monsters as CoffeeMonsters;
  });

  it('Mint some tokens', async () => {
    const amount = 1;

    expect(await nftContract.totalSupply()).to.be.eq(freeMintAmount);
    expect(await nftContract.balanceOf(user1.address)).to.be.eq(0);

    // safeMint()
    await nftContract.connect(user1).safeMint(amount, {
      value: ethers.utils.parseEther('0.00666'),
    });

    expect(await nftContract.totalSupply()).to.be.eq(freeMintAmount + amount);
    expect(await nftContract.balanceOf(user1.address)).to.be.eq(amount);

    // Check: Tx value below price
    await expect(
      nftContract.connect(user1).safeMint(amount, {
        value: ethers.utils.parseEther('0.00665'),
      }),
    ).to.be.revertedWith('Tx value below price');

    // safeMint()
    await nftContract.connect(user1).safeMint(amount, {
      value: ethers.utils.parseEther('0.00834'),
    });

    expect(await nftContract.totalSupply()).to.be.eq(freeMintAmount + amount * 2);
    expect(await nftContract.balanceOf(user1.address)).to.be.eq(amount * 2);
  });

  it('Set URI', async () => {
    expect(nftContract.connect(user1).setURI('ipfs://qqq/')).to.be.revertedWithCustomError; // onlyOwner

    await nftContract.connect(developer).setURI('ipfs://qqq/');

    expect(await nftContract.tokenURI(0)).to.be.eq('ipfs://qqq/0.json');
    expect(await nftContract.tokenURI(1)).to.be.eq('ipfs://qqq/1.json');
  });

  it('Check NFT contract data', async () => {
    expect(await nftContract.name()).to.equal('CoffeeMonsters');
    expect(await nftContract.symbol()).to.equal('CM');

    const erc721 = '0x80ac58cd';
    expect(await nftContract.supportsInterface(erc721)).to.equal(true);
  });

  it('Withdraw Eth from the contract', async () => {
    const totalContractBalance = ethers.utils.parseEther('0.015');
    const creatorBalanceAfterWithdraw = ethers.utils.parseEther('0.00501');
    const developerBalanceAfterWithdraw = ethers.utils.parseEther('0.004995');
    const designerBalanceAfterWithdraw = ethers.utils.parseEther('0.004995');

    const creatorBalanceBefore = await ethers.provider.getBalance(creator.address);
    const developerBalanceBefore = await ethers.provider.getBalance(developer.address);
    const designerBalanceBefore = await ethers.provider.getBalance(designer.address);
    expect(await ethers.provider.getBalance(nftContract.address)).to.be.eq(totalContractBalance);

    await nftContract.connect(user1).withdraw();

    await expect(nftContract.connect(user1).withdraw()).to.be.revertedWith('Zero balance');

    expect(await ethers.provider.getBalance(nftContract.address)).to.be.eq(0);
    const creatorBalanceAfter = await ethers.provider.getBalance(creator.address);
    const developerBalanceAfter = await ethers.provider.getBalance(developer.address);
    const designerBalanceAfter = await ethers.provider.getBalance(designer.address);

    // gap
    expect(creatorBalanceAfter.sub(creatorBalanceBefore)).to.be.eq(creatorBalanceAfterWithdraw);
    expect(developerBalanceAfter.sub(developerBalanceBefore)).to.be.eq(
      developerBalanceAfterWithdraw,
    );
    expect(designerBalanceAfter.sub(designerBalanceBefore)).to.be.eq(designerBalanceAfterWithdraw);

    expect(
      creatorBalanceAfterWithdraw
        .add(developerBalanceAfterWithdraw)
        .add(designerBalanceAfterWithdraw),
    ).to.be.eq(totalContractBalance);
  });

  it('Mint some tokens', async () => {
    const amount = 100;
    expect(await nftContract.totalSupply()).to.be.eq(freeMintAmount + 2);
    expect(await nftContract.balanceOf(user2.address)).to.be.eq(0);

    await nftContract.connect(user2).safeMint(amount, {
      value: ethers.utils.parseEther('0.00666').mul(amount),
    });

    expect(await nftContract.totalSupply()).to.be.eq(freeMintAmount + amount + 2);
    expect(await nftContract.balanceOf(user2.address)).to.be.eq(amount);

    await nftContract.connect(user4).safeMint(amount, {
      value: ethers.utils.parseEther('0.00666').mul(amount),
    });

    expect(await nftContract.totalSupply()).to.be.eq(freeMintAmount + 202);
    expect(await nftContract.balanceOf(user4.address)).to.be.eq(amount);

    await expect(
      nftContract.connect(user3).safeMint(amount * 30, {
        value: ethers.utils.parseEther('0.00666').mul(amount * 30),
      }),
    ).to.be.revertedWith('Max collection limit!');
    await nftContract.connect(user3).safeMint(amount, {
      value: ethers.utils.parseEther('0.006668263461').mul(amount),
    });

    expect(await nftContract.totalSupply()).to.be.eq(freeMintAmount + 302);
    expect(await nftContract.balanceOf(user3.address)).to.be.eq(amount);
  });

  it('Withdraw Eth from the contract', async () => {
    const totalContractBalance = ethers.utils.parseEther('1.9988263461');
    const creatorBalanceAfterWithdraw = ethers.utils.parseEther('0.6676079995974');
    const developerBalanceAfterWithdraw = ethers.utils.parseEther('0.6656091732513');
    const designerBalanceAfterWithdraw = ethers.utils.parseEther('0.6656091732513');

    const creatorBalanceBefore = await ethers.provider.getBalance(creator.address);
    const developerBalanceBefore = await ethers.provider.getBalance(developer.address);
    const designerBalanceBefore = await ethers.provider.getBalance(designer.address);
    expect(await ethers.provider.getBalance(nftContract.address)).to.be.eq(totalContractBalance);

    await nftContract.connect(user1).withdraw();

    expect(await ethers.provider.getBalance(nftContract.address)).to.be.eq(0);
    const creatorBalanceAfter = await ethers.provider.getBalance(creator.address);
    const developerBalanceAfter = await ethers.provider.getBalance(developer.address);
    const designerBalanceAfter = await ethers.provider.getBalance(designer.address);

    expect(creatorBalanceAfter.sub(creatorBalanceBefore)).to.be.eq(creatorBalanceAfterWithdraw);
    expect(developerBalanceAfter.sub(developerBalanceBefore)).to.be.eq(
      developerBalanceAfterWithdraw,
    );
    expect(designerBalanceAfter.sub(designerBalanceBefore)).to.be.eq(designerBalanceAfterWithdraw);

    expect(
      creatorBalanceAfterWithdraw
        .add(developerBalanceAfterWithdraw)
        .add(designerBalanceAfterWithdraw),
    ).to.be.eq(totalContractBalance);
  });
});
