import { ethers } from 'hardhat';

async function main() {
  // implementation
  // const sbtFactory = await ethers.deployContract('SBTFactory');
  // await sbtFactory.waitForDeployment();
  // console.log('SBTFactory deployed to:', sbtFactory.target);

  const sbtFactory = await ethers.getContractAt(
    'SBTFactory',
    '0x2613727f7e61Ad31069d1fE12d7109902DDF0656'
  );

  // proxy
  const sbtFactoryProxy = await ethers.getContractAt(
    'SBTFactory',
    '0xDd3E73Da01EFCAfF8Ad57Baa19F7dB21f99C7DC4'
  );

  const tx = await sbtFactoryProxy.upgradeToAndCall(
    sbtFactory.target,
    sbtFactory.interface.encodeFunctionData('owner'),
  );
  await tx.wait();
  console.log('SBTFactory has been upgraded, transaction:', tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
