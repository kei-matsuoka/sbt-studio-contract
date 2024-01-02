import { ethers } from 'hardhat';

async function main() {
  const membershipSBT = await ethers.getContractAt(
    'MembershipSBT',
    '0x0a909a203d4962a82f838282f71b0886f2c9137f'
  );

  let tx = await membershipSBT.safeMintBatch([
    '0x5e8257ad0818e9a51bce43722c87b5eb0237c135',
    '0xF0058777F622bF6FD08bDD14d5Cb2660e0deDB25',
    '0x9a96f29e57e0b789af796ab328df19874f89726a',
  ]);

  await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
