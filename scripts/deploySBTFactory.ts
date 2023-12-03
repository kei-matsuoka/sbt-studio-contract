import { ethers } from 'hardhat';

async function main() {
  // implementation
  const sbtFactory = await ethers.deployContract('SBTFactory');
  await sbtFactory.waitForDeployment();
  console.log('SBTFactory deployed to:', sbtFactory.target);

  // proxy
  const data = sbtFactory.interface.encodeFunctionData('initialize');
  const sbtFactoryProxy = await ethers.deployContract('ERC1967Proxy', [
    sbtFactory.target,
    data,
  ]);
  await sbtFactoryProxy.waitForDeployment();
  console.log('SBTFactoryProxy deployed to:', sbtFactoryProxy.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
