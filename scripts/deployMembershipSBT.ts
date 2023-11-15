import { ethers } from 'hardhat';

async function main() {
  // // const initialOwner = '0x9A96f29e57E0b789af796aB328Df19874F89726A';
  const initialOwner = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

  const membershipSBT = await ethers.deployContract('MembershipSBT', [
    initialOwner,
  ]);
  await membershipSBT.waitForDeployment();
  console.log('MembershipSBT deployed to:', membershipSBT.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// // implementation
// const membershipSBT = await ethers.deployContract('MembershipSBT');
// await membershipSBT.waitForDeployment();
// console.log('MembershipSBT deployed to:', membershipSBT.target);

// // proxy
// const data = membershipSBT.interface.encodeFunctionData('initialize', [
//   initialOwner,
// ]);
// const membershipSBTProxy = await ethers.deployContract('ERC1967Proxy', [
//   membershipSBT.target,
//   data,
// ]);
// await membershipSBTProxy.waitForDeployment();
// console.log('MembershipSBTProxy deployed to:', membershipSBTProxy.target);
