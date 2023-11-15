import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('MembershipSBT', function () {
  async function deployMembershipSBTFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const membershipSBT = await ethers.deployContract('MembershipSBT', [
      owner.address,
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
      expect(await membershipSBT.name()).to.equal('MembershipSBT');
    });

    it('Should set the right symbol', async function () {
      const { membershipSBT } = await loadFixture(deployMembershipSBTFixture);
      expect(await membershipSBT.symbol()).to.equal('MSBT');
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
