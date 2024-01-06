import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

const metadata = {
  name: 'Fitness Gym Membership',
  image: 'https://ipfs.io/ipfs/QmWU8qrJm4ByGdSSyoaqvG4YbzAm4EZFHQG7L7LLCVfwvM',
  description:
    'This is a membership token for the Fitness Gym. It is a soul-bound token (SBT) that can be used to redeem a 1 year membership at the Fitness Gym.',
};

const name = 'Fitness Gym Membership';
const symbol = 'FGM';
const baseURI =
  'https://ipfs.io/ipfs/QmVLqt2tN4NCeYdCsTg1rMeZTmT2D8spowhSnNSLuXtsM2/';
const maxSupply = 2;
const burnAuth = { IssuerOnly: 0, OwnerOnly: 1, Both: 2, Neither: 3 };

describe('MembershipSBT', function () {
  async function deployMembershipSBTFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const membershipSBT = await ethers.deployContract('MembershipSBT', [
      name,
      symbol,
      baseURI,
      maxSupply,
      burnAuth.IssuerOnly,
      owner.address,
    ]);
    await membershipSBT.waitForDeployment();

    return { membershipSBT, owner, addr1, addr2, burnAuth };
  }

  describe('Deployment', function () {
    it('Should set the right name', async function () {
      const { membershipSBT } = await loadFixture(deployMembershipSBTFixture);
      expect(await membershipSBT.name()).to.equal('Fitness Gym Membership');
    });

    it('Should set the right symbol', async function () {
      const { membershipSBT } = await loadFixture(deployMembershipSBTFixture);
      expect(await membershipSBT.symbol()).to.equal('FGM');
    });

    it('Should set the right maxSupply', async function () {
      const { membershipSBT } = await loadFixture(deployMembershipSBTFixture);
      expect(await membershipSBT.maxSupply()).to.equal(2);
    });

    it('Should set the right burnAuth', async function () {
      const { membershipSBT } = await loadFixture(deployMembershipSBTFixture);
      expect(await membershipSBT.burnAuth(0)).to.equal(0);
    });

    it('Should set the right owner', async function () {
      const { membershipSBT, owner } = await loadFixture(
        deployMembershipSBTFixture
      );
      expect(await membershipSBT.owner()).to.equal(owner.address);
    });
  });

  describe('Locking', function () {
    it('Should return true if locked', async function () {
      const { membershipSBT } = await loadFixture(deployMembershipSBTFixture);
      await membershipSBT.lock(0);
      expect(await membershipSBT.locked(0)).to.equal(true);
    });

    it('Should return false if not locked', async function () {
      const { membershipSBT } = await loadFixture(deployMembershipSBTFixture);
      expect(await membershipSBT.locked(0)).to.equal(false);
    });

    it('Should lock the token', async function () {
      const { membershipSBT } = await loadFixture(deployMembershipSBTFixture);
      await membershipSBT.lock(0);
      expect(await membershipSBT.locked(0)).to.equal(true);
    });

    it('Should emit a Locked event', async function () {
      const { membershipSBT } = await loadFixture(deployMembershipSBTFixture);
      await expect(membershipSBT.lock(0))
        .to.emit(membershipSBT, 'Locked')
        .withArgs(0);
    });

    it('Should unlock the token', async function () {
      const { membershipSBT } = await loadFixture(deployMembershipSBTFixture);
      await membershipSBT.lock(0);
      await membershipSBT.unlock(0);
      expect(await membershipSBT.locked(0)).to.equal(false);
    });

    it('Should emit an Unlocked event', async function () {
      const { membershipSBT } = await loadFixture(deployMembershipSBTFixture);
      await membershipSBT.lock(0);
      await expect(membershipSBT.unlock(0))
        .to.emit(membershipSBT, 'Unlocked')
        .withArgs(0);
    });

    it('Should fail if not the owner', async function () {
      const { membershipSBT, addr1 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await expect(membershipSBT.connect(addr1).lock(0)).to.be.reverted;
    });
  });

  describe('Minting', function () {
    it('Should mint a new token', async function () {
      const { membershipSBT, addr1 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await membershipSBT.safeMint(addr1.address);
      expect(await membershipSBT.balanceOf(addr1.address)).to.equal(1);
    });

    it('Should return the right tokenURI', async function () {
      const { membershipSBT, addr1 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await membershipSBT.safeMint(addr1.address);
      expect(await membershipSBT.tokenURI(0)).to.equal(`${baseURI}0`);
    });

    it('Should fail if not the owner', async function () {
      const { membershipSBT, addr1 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await expect(membershipSBT.connect(addr1).safeMint(addr1.address)).to.be
        .reverted;
    });

    it('Should fail if minting more than one token per account', async function () {
      const { membershipSBT, addr1 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await membershipSBT.safeMint(addr1.address);
      await expect(membershipSBT.safeMint(addr1.address)).to.be.revertedWith(
        'You can mint only one token'
      );
    });

    it('Should mint a new token if maxSupply is 0', async function () {
      const { membershipSBT, addr1 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await membershipSBT.safeMint(addr1.address);
      expect(await membershipSBT.balanceOf(addr1.address)).to.equal(1);
    });

    it('Should fail if maxSupply is reached', async function () {
      const { membershipSBT, owner, addr1, addr2 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await membershipSBT.safeMintBatch([owner.address, addr1.address]);
      await expect(membershipSBT.safeMint(addr2.address)).to.be.revertedWith(
        'Max supply reached'
      );
    });

    it('Should increase the tokenId', async function () {
      const { membershipSBT, addr1, addr2 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await membershipSBT.safeMint(addr1.address);
      await membershipSBT.safeMint(addr2.address);
      expect(await membershipSBT.tokenURI(1)).to.equal(`${baseURI}1`);
    });

    it('Should set the right burnAuth', async function () {
      const { membershipSBT, addr1 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await membershipSBT.safeMint(addr1.address);
      expect(await membershipSBT.burnAuth(0)).to.equal(0);
    });

    it('Should lock the token', async function () {
      const { membershipSBT, addr1 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await membershipSBT.safeMint(addr1.address);
      expect(await membershipSBT.locked(0)).to.equal(true);
    });

    it('Should emit an Issued event', async function () {
      const { membershipSBT, owner, addr1 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await expect(membershipSBT.safeMint(addr1.address))
        .to.emit(membershipSBT, 'Issued')
        .withArgs(owner.address, addr1.address, 0, 0);
    });
  });

  describe('Minting Batch', function () {
    it('Should mint multiple tokens', async function () {
      const { membershipSBT, owner, addr1 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await membershipSBT.safeMintBatch([owner.address, addr1.address]);
      expect(await membershipSBT.balanceOf(owner.address)).to.equal(1);
      expect(await membershipSBT.balanceOf(addr1.address)).to.equal(1);
    });

    it('Should fail if not the owner', async function () {
      const { membershipSBT, addr1 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await expect(membershipSBT.connect(addr1).safeMintBatch([addr1.address]))
        .to.be.reverted;
    });
  });

  describe('Burning', function () {
    it('Should return true if burnAuth is IssuerOnly', async function () {
      const { membershipSBT, addr1 } = await loadFixture(
        deployMembershipSBTFixture
      );
      expect(await membershipSBT.burnAuth(0)).to.equal(0);
    });
    it('Should burn a token', async function () {
      const { membershipSBT, addr1 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await membershipSBT.safeMint(addr1.address);
      await membershipSBT.burn(0);
      expect(await membershipSBT.balanceOf(addr1.address)).to.equal(0);
    });

    it('Should not allow others to burn a token', async function () {
      const { membershipSBT, addr1 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await membershipSBT.safeMint(addr1.address);
      await expect(membershipSBT.connect(addr1).burn(0)).to.be.revertedWith(
        'Only issuer can burn'
      );
    });
  });

  describe('Transferring', function () {
    it('Should not allow token transfers', async function () {
      const { membershipSBT, addr1, addr2 } = await loadFixture(
        deployMembershipSBTFixture
      );
      await membershipSBT.safeMint(addr1.address);
      await expect(
        membershipSBT.transferFrom(addr1.address, addr2.address, 0)
      ).to.be.revertedWith('Token is locked');
    });
  });

  describe('Supports Interface', function () {
    it('Should return true for IERC165', async function () {
      const { membershipSBT } = await loadFixture(deployMembershipSBTFixture);
      expect(await membershipSBT.supportsInterface('0x01ffc9a7')).to.equal(
        true
      );
    });
    it('Should return true for IERC721', async function () {
      const { membershipSBT } = await loadFixture(deployMembershipSBTFixture);
      expect(await membershipSBT.supportsInterface('0x80ac58cd')).to.equal(
        true
      );
    });
    it('Should return true for IERC721Metadata', async function () {
      const { membershipSBT } = await loadFixture(deployMembershipSBTFixture);
      expect(await membershipSBT.supportsInterface('0x5b5e139f')).to.equal(
        true
      );
    });
    it('Should return true for IERC5192', async function () {
      const { membershipSBT } = await loadFixture(deployMembershipSBTFixture);
      expect(await membershipSBT.supportsInterface('0xb45a3c0e')).to.equal(
        true
      );
    });
    it('Should return true for IERC5484', async function () {
      const { membershipSBT } = await loadFixture(deployMembershipSBTFixture);
      expect(await membershipSBT.supportsInterface('0x01ffc9a7')).to.equal(
        true
      );
    });
    it('Should return false for random interface', async function () {
      const { membershipSBT } = await loadFixture(deployMembershipSBTFixture);
      expect(await membershipSBT.supportsInterface('0x00000000')).to.equal(
        false
      );
    });
  });
});
