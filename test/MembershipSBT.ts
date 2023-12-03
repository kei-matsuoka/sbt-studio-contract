import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

const metadata = {
  name: 'Fitness Gym Membership',
  image: 'https://ipfs.io/ipfs/QmWU8qrJm4ByGdSSyoaqvG4YbzAm4EZFHQG7L7LLCVfwvM',
  description:
    'This is a membership token for the Fitness Gym. It is a soul-bound token (SBT) that can be used to redeem a 1 year membership at the Fitness Gym.',
};

describe('MembershipSBT', function () {
  async function deployMembershipSBTFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const membershipSBT = await ethers.deployContract('MembershipSBT', [
      'Fitness Gym Membership',
      'FGM',
      'https://ipfs.io/ipfs/QmVLqt2tN4NCeYdCsTg1rMeZTmT2D8spowhSnNSLuXtsM2/',
    ]);
    await membershipSBT.waitForDeployment();

    return { membershipSBT, owner, addr1, addr2 };
  }

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const { membershipSBT, owner } = await loadFixture(
        deployMembershipSBTFixture
      );
      expect(await membershipSBT.owner()).to.equal(owner.address);
    });

    it('Should set the right name', async function () {
      const { membershipSBT } = await loadFixture(deployMembershipSBTFixture);
      expect(await membershipSBT.name()).to.equal('Fitness Gym Membership');
    });

    it('Should set the right symbol', async function () {
      const { membershipSBT } = await loadFixture(deployMembershipSBTFixture);
      expect(await membershipSBT.symbol()).to.equal('FGM');
    });
  });

  describe('Minting', function () {
    it('Should mint a new token', async function () {
      const { membershipSBT, addr1 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await membershipSBT.connect(addr1).safeMint();
      expect(await membershipSBT.balanceOf(addr1.address)).to.equal(1);
    });

    it('Should return the right tokenURI', async function () {
      const { membershipSBT, addr1 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await membershipSBT.connect(addr1).safeMint();
      expect(await membershipSBT.tokenURI(0)).to.equal(
        'https://ipfs.io/ipfs/QmVLqt2tN4NCeYdCsTg1rMeZTmT2D8spowhSnNSLuXtsM2/0'
      );
    });

    it('Should fail if minting more than one token per account', async function () {
      const { membershipSBT, addr1 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await membershipSBT.connect(addr1).safeMint();
      await expect(membershipSBT.connect(addr1).safeMint()).to.be.revertedWith(
        'You can mint only one token'
      );
    });
  });

  describe('Transfer', function () {
    it('Should not allow token transfers', async function () {
      const { membershipSBT, addr1, addr2 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await membershipSBT.connect(addr1).safeMint();
      await expect(
        membershipSBT
          .connect(addr1)
          .transferFrom(addr1.address, addr2.address, 0)
      ).to.be.revertedWith('Token transfer is not allowed');
    });
  });

  describe('Pause', function () {
    it('Should pause and unpause the contract', async function () {
      const { membershipSBT, addr1 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await membershipSBT.pause();
      await expect(membershipSBT.connect(addr1).safeMint()).to.be.reverted;

      await membershipSBT.unpause();
      await membershipSBT.connect(addr1).safeMint();
      expect(await membershipSBT.balanceOf(addr1.address)).to.equal(1);
    });
  });

  describe('Burn', function () {
    it('Should burn a token', async function () {
      const { membershipSBT, addr1 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await membershipSBT.connect(addr1).safeMint();
      await membershipSBT.connect(addr1).burn(0);
      expect(await membershipSBT.balanceOf(addr1.address)).to.equal(0);
    });

    it('Should not allow others to burn a token', async function () {
      const { membershipSBT, addr1, addr2 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await membershipSBT.connect(addr1).safeMint();
      await expect(membershipSBT.connect(addr2).burn(0)).to.be.reverted;
    });
  });
});
