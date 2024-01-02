import { ethers } from 'hardhat';

async function main() {
  // SBTFactoryを取得
  const sbtFactory = await ethers.getContractAt(
    'SBTFactory',
    '0xb264Da2E6E7cDbc5d9Ad9C57562acc618fc78190'
  );

  // createMembershipSBT
  let tx = await sbtFactory.createMembershipSBT(
    'Fitness Gym Membership',
    'FGM',
    'https://ipfs.io/ipfs/QmVLqt2tN4NCeYdCsTg1rMeZTmT2D8spowhSnNSLuXtsM2/',
    100,
    0,
    'https://ipfs.io/ipfs/QmWU8qrJm4ByGdSSyoaqvG4YbzAm4EZFHQG7L7LLCVfwvM',
    'This is a membership token for the Fitness Gym. It is a soul-bound token (SBT) that can be used to redeem a 1 year membership at the Fitness Gym.',
    { value: ethers.parseEther('0.01') }
  );

  await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
