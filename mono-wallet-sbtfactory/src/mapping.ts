import { SBTCreated } from '../generated/SBTFactory/SBTFactory';
import { Creator, CreatedToken, Minter } from '../generated/schema';
import {
  BaseURISet,
  DefaultBurnAuthSet,
  Issued,
  MaxSupplySet,
  Transfer,
} from '../generated/templates/MembershipSBT/MembershipSBT';
import { MembershipSBT } from '../generated/templates';
import { MintedToken } from '../generated/schema';

export function handleSBTCreated(event: SBTCreated): void {
  MembershipSBT.create(event.params.sbtAddress);

  let creator = Creator.load(event.transaction.from.toHexString());

  if (!creator) {
    creator = new Creator(event.transaction.from.toHexString());
    creator.save();
  }

  let token = new CreatedToken(event.params.sbtAddress.toHexString());

  token.name = event.params.name;
  token.symbol = event.params.symbol;
  token.imageURI = event.params.image;
  token.maxSupply = event.params.maxSupply;
  token.burnAuth = event.params.defaultBurnAuth;
  token.description = event.params.description;
  token.creator = creator.id;
  token.createdAtTimestamp = event.block.timestamp;

  token.save();
}

export function handleMinted(event: Issued): void {
  let minter = Minter.load(event.params.to.toHexString());

  if (!minter) {
    minter = new Minter(event.params.to.toHexString());
    minter.save();
  }

  let sbtAddress = event.address.toHexString();
  let tokenId = event.params.tokenId.toString();
  let tokenUniqueId = sbtAddress + '-' + tokenId;
  let token = new MintedToken(tokenUniqueId);

  token.tokenId = event.params.tokenId;
  token.minter = event.params.to.toHexString();
  token.creator = event.params.from.toHexString();
  token.createdToken = event.address.toHexString();
  token.mintedAtTimestamp = event.block.timestamp;
  token.isBurned = false;

  token.save();
}

export function handleTransfer(event: Transfer): void {
  let sbtAddress = event.address.toHexString();
  let tokenId = event.params.tokenId.toString();
  let tokenUniqueId = sbtAddress + '-' + tokenId;
  let token = MintedToken.load(tokenUniqueId);

  if (
    token &&
    event.params.to.toHexString() ==
      '0x0000000000000000000000000000000000000000'
  ) {
    token.isBurned = true;
    token.save();
  }
}

export function handleBaseURISet(event: BaseURISet): void {
  let sbtAddress = event.address.toHexString();
  let token = CreatedToken.load(sbtAddress);

  if (token) {
    token.imageURI = event.params.image;
    token.description = event.params.description;
    token.save();
  }
}

export function handleMaxSupplySet(event: MaxSupplySet): void {
  let sbtAddress = event.address.toHexString();
  let token = CreatedToken.load(sbtAddress);

  if (token) {
    token.maxSupply = event.params.maxSupply;
    token.save();
  }
}

export function handleDefaultBurnAuthSet(event: DefaultBurnAuthSet): void {
  let sbtAddress = event.address.toHexString();
  let token = CreatedToken.load(sbtAddress);

  if (token) {
    token.burnAuth = event.params.defaultBurnAuth;
    token.save();
  }
}
