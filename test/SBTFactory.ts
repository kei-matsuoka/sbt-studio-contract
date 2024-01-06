import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import SBTFactoryJson from '../artifacts/contracts/SBTFactory.sol/SBTFactory.json';

const name = 'Fitness Gym Membership';
const symbol = 'FGM';
const baseURI =
  'https://ipfs.io/ipfs/QmVLqt2tN4NCeYdCsTg1rMeZTmT2D8spowhSnNSLuXtsM2/';
const maxSupply = 2;
const burnAuth = { IssuerOnly: 0, OwnerOnly: 1, Both: 2, Neither: 3 };

const metadata = {
  name: 'Fitness Gym Membership',
  image: 'https://ipfs.io/ipfs/QmWU8qrJm4ByGdSSyoaqvG4YbzAm4EZFHQG7L7LLCVfwvM',
  description:
    'This is a membership token for the Fitness Gym. It is a soul-bound token (SBT) that can be used to redeem a 1 year membership at the Fitness Gym.',
};

const creationFee = ethers.parseEther('0.01');
const sbtAddress = '0x75537828f2ce51be7289709686A69CbFDbB714F1';

describe('SBTFactory', function () {
  async function deploySBTFactoryProxyContractFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const sbtFactory = await ethers.deployContract('SBTFactory');
    await sbtFactory.waitForDeployment();

    const data = sbtFactory.interface.encodeFunctionData('initialize');
    const sbtFactoryProxy = await ethers.deployContract('ERC1967Proxy', [
      sbtFactory.target,
      data,
    ]);
    await sbtFactoryProxy.waitForDeployment();

    const sbtFactoryProxyContract = new ethers.Contract(
      sbtFactoryProxy.target as string,
      SBTFactoryJson.abi,
      owner
    );

    return { sbtFactoryProxyContract, owner, addr1, addr2 };
  }

  describe('Deployment', function () {
    it('Should set the right creationFee', async function () {
      const { sbtFactoryProxyContract } = await loadFixture(
        deploySBTFactoryProxyContractFixture
      );
      expect(await sbtFactoryProxyContract.creationFee()).to.equal(creationFee);
    });

    it('Should set the right owner', async function () {
      const { sbtFactoryProxyContract, owner } = await loadFixture(
        deploySBTFactoryProxyContractFixture
      );
      expect(await sbtFactoryProxyContract.owner()).to.equal(owner.address);
    });

    it('Should revert if already initialized', async function () {
      const { sbtFactoryProxyContract } = await loadFixture(
        deploySBTFactoryProxyContractFixture
      );
      await expect(sbtFactoryProxyContract.initialize()).to.be.reverted;
    });
  });

  describe('createSBT', function () {
    it('Should create a new SBT and emit an event', async function () {
      const { sbtFactoryProxyContract } = await loadFixture(
        deploySBTFactoryProxyContractFixture
      );

      await expect(
        sbtFactoryProxyContract.createMembershipSBT(
          name,
          symbol,
          baseURI,
          maxSupply,
          burnAuth.IssuerOnly,
          metadata.image,
          metadata.description,
          { value: creationFee }
        )
      )
        .to.emit(sbtFactoryProxyContract, 'SBTCreated')
        .withArgs(
          sbtAddress,
          name,
          symbol,
          maxSupply,
          burnAuth.IssuerOnly,
          metadata.image,
          metadata.description
        );
    });
  });

  // withdraw
  describe('withdraw', function () {
    it('Should withdraw the creationFee', async function () {
      const { sbtFactoryProxyContract, owner, addr1 } = await loadFixture(
        deploySBTFactoryProxyContractFixture
      );

      const balance1 = await ethers.provider.getBalance(owner.address);

      await sbtFactoryProxyContract
        .connect(addr1)
        .createMembershipSBT(
          name,
          symbol,
          baseURI,
          maxSupply,
          burnAuth.IssuerOnly,
          metadata.image,
          metadata.description,
          { value: creationFee }
        );

      const tx = await sbtFactoryProxyContract.withdraw();
      await tx.wait();

      const balance2 = await ethers.provider.getBalance(owner.address);

      expect(balance2 > balance1).to.equal(true);
    });

    it('Should revert if not owner', async function () {
      const { sbtFactoryProxyContract, addr1 } = await loadFixture(
        deploySBTFactoryProxyContractFixture
      );

      await expect(sbtFactoryProxyContract.connect(addr1).withdraw()).to.be
        .reverted;
    });
  });

  describe('setCreationFee', function () {
    it('Should set the creationFee', async function () {
      const { sbtFactoryProxyContract } = await loadFixture(
        deploySBTFactoryProxyContractFixture
      );

      const tx = await sbtFactoryProxyContract.setCreationFee(
        ethers.parseEther('0.02')
      );
      await tx.wait();

      expect(await sbtFactoryProxyContract.creationFee()).to.equal(
        ethers.parseEther('0.02')
      );
    });

    it('Should revert if not owner', async function () {
      const { sbtFactoryProxyContract, addr1 } = await loadFixture(
        deploySBTFactoryProxyContractFixture
      );

      await expect(
        sbtFactoryProxyContract.connect(addr1).setCreationFee(creationFee)
      ).to.be.reverted;
    });
  });
});
