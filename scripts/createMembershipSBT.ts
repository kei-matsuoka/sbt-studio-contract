import { ethers } from 'hardhat';

async function main() {
  const name = 'Fitness Gym Membership';
  const symbol = 'FGM';
  const baseURI =
    'https://ipfs.io/ipfs/QmVLqt2tN4NCeYdCsTg1rMeZTmT2D8spowhSnNSLuXtsM2/';
  const maxSupply = 2;
  const burnAuth = { IssuerOnly: 0, OwnerOnly: 1, Both: 2, Neither: 3 };

  const metadata = {
    name: 'Fitness Gym Membership',
    image:
      'https://ipfs.io/ipfs/QmWU8qrJm4ByGdSSyoaqvG4YbzAm4EZFHQG7L7LLCVfwvM',
    description:
      'This is a membership token for the Fitness Gym. It is a soul-bound token (SBT) that can be used to redeem a 1 year membership at the Fitness Gym.',
  };

  // SBTFactoryを取得
  const sbtFactory = await ethers.getContractAt(
    'SBTFactory',
    '0xb264Da2E6E7cDbc5d9Ad9C57562acc618fc78190'
  );

  // createMembershipSBT
  let tx = await sbtFactory.createMembershipSBT(
    name,
    symbol,
    baseURI,
    maxSupply,
    burnAuth.IssuerOnly,
    metadata.image,
    metadata.description,
    { value: ethers.parseEther('0.01') }
  );

  await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
