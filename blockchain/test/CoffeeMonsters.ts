import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { CoffeeMonsters } from '../typechain-types';
import { partnerAddresses } from '../WL/partnerAddresses';
import { mintNFTs } from '../scripts/2_freeMint';
import hre from 'hardhat';

const partner1address = '0x3b1c37a99fb0821f40dbc665dc910a606f5f5acf';
const partner2address = '0xd125f77eadb178ab4691317b2f1cd6754aca5399';
const partner3address = '0x467f54a769555f9812177f059f1bbc3d30854dba';
const freeMintAmount = 84;
const fullPrice = ethers.utils.parseEther('0.00666');
const partnerPrice = ethers.utils.parseEther('0.00333');

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
  let partner1: SignerWithAddress;
  let partner2: SignerWithAddress;
  let partner3: SignerWithAddress;

  before(async () => {
    signers = await ethers.getSigners();
    creator = signers[0];
    developer = signers[1];
    designer = signers[2];
    user1 = signers[3];
    user2 = signers[4];
    user3 = signers[5];
    user4 = signers[6];

    // impersonate Account
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [partner1address],
    });
    partner1 = await ethers.getSigner(partner1address);

    // impersonate Account
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [partner2address],
    });
    partner2 = await ethers.getSigner(partner2address);

    // impersonate Account
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [partner3address],
    });
    partner3 = await ethers.getSigner(partner3address);
  });

  it('Send Ether to partner1 and partner2', async () => {
    await developer.sendTransaction({
      to: partner1.address,
      value: ethers.utils.parseEther('1'),
    });

    await developer.sendTransaction({
      to: partner2.address,
      value: ethers.utils.parseEther('1'),
    });

    await developer.sendTransaction({
      to: partner3.address,
      value: ethers.utils.parseEther('1'),
    });
  });

  it('Deploy contract', async () => {
    const Factory = await ethers.getContractFactory('CoffeeMonsters');
    const monsters = await Factory.deploy(
      creator.address,
      developer.address,
      designer.address,
      creator.address,
      1000,
      partnerAddresses,
    );

    expect(monsters.address).to.not.eq(ethers.constants.AddressZero);
    nftContract = monsters as CoffeeMonsters;
  });

  it('Set URI', async () => {
    expect(
      nftContract
        .connect(user1)
        .setURI('https://arweave.net/vfYdCCJyrjLrnNSvlld7c5RqVcqOcc7zarM_jjFWN_I/coffee_jsons/'),
    ).to.be.revertedWithCustomError; // onlyOwner

    await nftContract
      .connect(developer)
      .setURI('https://arweave.net/vfYdCCJyrjLrnNSvlld7c5RqVcqOcc7zarM_jjFWN_I/coffee_jsons/');

    expect(await nftContract.tokenURI(0)).to.be.eq(
      'https://arweave.net/vfYdCCJyrjLrnNSvlld7c5RqVcqOcc7zarM_jjFWN_I/coffee_jsons/0.json',
    );
    expect(await nftContract.tokenURI(1)).to.be.eq(
      'https://arweave.net/vfYdCCJyrjLrnNSvlld7c5RqVcqOcc7zarM_jjFWN_I/coffee_jsons/1.json',
    );
  });

  it('Mint free tokens', async () => {
    await mintNFTs(developer, nftContract);
  });

  it('Mint some tokens', async () => {
    const amount = 1;

    expect(await nftContract.totalSupply()).to.be.eq(freeMintAmount);
    expect(await nftContract.balanceOf(user1.address)).to.be.eq(0);

    // safeMintForPartners()
    await nftContract.connect(partner1).safeMintForPartners({
      value: partnerPrice,
    });

    // safeMintForPartners()
    await nftContract.connect(partner2).safeMintForPartners({
      value: partnerPrice,
    });

    expect(await nftContract.totalSupply()).to.be.eq(86);
    expect(await nftContract.balanceOf(partner1.address)).to.be.eq(amount);
    expect(await nftContract.balanceOf(partner2.address)).to.be.eq(amount);

    // safeMint()
    await nftContract.connect(partner1).safeMint(amount, {
      value: ethers.utils.parseEther('0.00834'),
    });

    expect(await nftContract.totalSupply()).to.be.eq(87);
    expect(await nftContract.balanceOf(partner1.address)).to.be.eq(amount * 2);
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
    // withdraw()
    await nftContract.connect(user1).withdraw();
    expect(await ethers.provider.getBalance(nftContract.address)).to.be.eq(0);

    await expect(nftContract.connect(user1).withdraw()).to.be.revertedWith('Zero balance');

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
    expect(await nftContract.totalSupply()).to.be.eq(87);
    expect(await nftContract.balanceOf(user2.address)).to.be.eq(0);

    await nftContract.connect(user2).safeMint(amount, {
      value: fullPrice.mul(amount),
    });

    expect(await nftContract.totalSupply()).to.be.eq(187);
    expect(await nftContract.balanceOf(user2.address)).to.be.eq(amount);

    await nftContract.connect(user4).safeMint(amount, {
      value: fullPrice.mul(amount),
    });

    expect(await nftContract.totalSupply()).to.be.eq(287);
    expect(await nftContract.balanceOf(user4.address)).to.be.eq(amount);

    await nftContract.connect(user3).safeMint(amount, {
      value: ethers.utils.parseEther('0.006668263461').mul(amount),
    });

    expect(await nftContract.totalSupply()).to.be.eq(387);
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
    // withdraw()
    await nftContract.connect(user1).withdraw();
    expect(await ethers.provider.getBalance(nftContract.address)).to.be.eq(0);

    await expect(nftContract.connect(user1).withdraw()).to.be.revertedWith('Zero balance');

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

  it('Mint reverts', async () => {
    // Check: Tx value below price
    await expect(
      nftContract.connect(partner1).safeMint(1, {
        value: ethers.utils.parseEther('0.00665'),
      }),
    ).to.be.revertedWith('Tx value below price');

    // Check: Tx value below price
    await expect(
      nftContract.connect(partner3).safeMintForPartners({
        value: ethers.utils.parseEther('0.00332'),
      }),
    ).to.be.revertedWith('Tx value below price');

    // Check: Not a partner
    await expect(
      nftContract.connect(user4).safeMintForPartners({
        value: partnerPrice,
      }),
    ).to.be.revertedWith('Not a partner');

    // Check: Not a partner
    await expect(
      nftContract.connect(partner1).safeMintForPartners({
        value: partnerPrice,
      }),
    ).to.be.revertedWith('Not a partner');

    // mint 666 tokens
    await nftContract.connect(user3).safeMint(179, {
      value: fullPrice.mul(179),
    });
    await nftContract.connect(user3).safeMint(100, {
      value: fullPrice.mul(100),
    });
    expect(await nftContract.totalSupply()).to.be.eq(666);

    // Check: Max collection limit!
    await expect(
      nftContract.connect(partner3).safeMintForPartners({
        value: partnerPrice,
      }),
    ).to.be.revertedWith('Max collection limit!');

    // Check: Max collection limit!
    await expect(
      nftContract.connect(user3).safeMint(1, {
        value: fullPrice,
      }),
    ).to.be.revertedWith('Max collection limit!');
  });
});
