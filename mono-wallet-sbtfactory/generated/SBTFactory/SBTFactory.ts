// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Initialized extends ethereum.Event {
  get params(): Initialized__Params {
    return new Initialized__Params(this);
  }
}

export class Initialized__Params {
  _event: Initialized;

  constructor(event: Initialized) {
    this._event = event;
  }

  get version(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class SBTCreated extends ethereum.Event {
  get params(): SBTCreated__Params {
    return new SBTCreated__Params(this);
  }
}

export class SBTCreated__Params {
  _event: SBTCreated;

  constructor(event: SBTCreated) {
    this._event = event;
  }

  get sbtAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get name(): string {
    return this._event.parameters[1].value.toString();
  }

  get symbol(): string {
    return this._event.parameters[2].value.toString();
  }

  get maxSupply(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get defaultBurnAuth(): i32 {
    return this._event.parameters[4].value.toI32();
  }

  get image(): string {
    return this._event.parameters[5].value.toString();
  }

  get description(): string {
    return this._event.parameters[6].value.toString();
  }
}

export class Upgraded extends ethereum.Event {
  get params(): Upgraded__Params {
    return new Upgraded__Params(this);
  }
}

export class Upgraded__Params {
  _event: Upgraded;

  constructor(event: Upgraded) {
    this._event = event;
  }

  get implementation(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class SBTFactory extends ethereum.SmartContract {
  static bind(address: Address): SBTFactory {
    return new SBTFactory("SBTFactory", address);
  }

  UPGRADE_INTERFACE_VERSION(): string {
    let result = super.call(
      "UPGRADE_INTERFACE_VERSION",
      "UPGRADE_INTERFACE_VERSION():(string)",
      []
    );

    return result[0].toString();
  }

  try_UPGRADE_INTERFACE_VERSION(): ethereum.CallResult<string> {
    let result = super.tryCall(
      "UPGRADE_INTERFACE_VERSION",
      "UPGRADE_INTERFACE_VERSION():(string)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  creationFee(): BigInt {
    let result = super.call("creationFee", "creationFee():(uint256)", []);

    return result[0].toBigInt();
  }

  try_creationFee(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("creationFee", "creationFee():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  proxiableUUID(): Bytes {
    let result = super.call("proxiableUUID", "proxiableUUID():(bytes32)", []);

    return result[0].toBytes();
  }

  try_proxiableUUID(): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "proxiableUUID",
      "proxiableUUID():(bytes32)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class CreateMembershipSBTCall extends ethereum.Call {
  get inputs(): CreateMembershipSBTCall__Inputs {
    return new CreateMembershipSBTCall__Inputs(this);
  }

  get outputs(): CreateMembershipSBTCall__Outputs {
    return new CreateMembershipSBTCall__Outputs(this);
  }
}

export class CreateMembershipSBTCall__Inputs {
  _call: CreateMembershipSBTCall;

  constructor(call: CreateMembershipSBTCall) {
    this._call = call;
  }

  get name(): string {
    return this._call.inputValues[0].value.toString();
  }

  get symbol(): string {
    return this._call.inputValues[1].value.toString();
  }

  get baseURI(): string {
    return this._call.inputValues[2].value.toString();
  }

  get maxSupply(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get defaultBurnAuth(): i32 {
    return this._call.inputValues[4].value.toI32();
  }

  get image(): string {
    return this._call.inputValues[5].value.toString();
  }

  get description(): string {
    return this._call.inputValues[6].value.toString();
  }
}

export class CreateMembershipSBTCall__Outputs {
  _call: CreateMembershipSBTCall;

  constructor(call: CreateMembershipSBTCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.outputValues[0].value.toAddress();
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SetCreationFeeCall extends ethereum.Call {
  get inputs(): SetCreationFeeCall__Inputs {
    return new SetCreationFeeCall__Inputs(this);
  }

  get outputs(): SetCreationFeeCall__Outputs {
    return new SetCreationFeeCall__Outputs(this);
  }
}

export class SetCreationFeeCall__Inputs {
  _call: SetCreationFeeCall;

  constructor(call: SetCreationFeeCall) {
    this._call = call;
  }

  get _creationFee(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetCreationFeeCall__Outputs {
  _call: SetCreationFeeCall;

  constructor(call: SetCreationFeeCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class UpgradeToAndCallCall extends ethereum.Call {
  get inputs(): UpgradeToAndCallCall__Inputs {
    return new UpgradeToAndCallCall__Inputs(this);
  }

  get outputs(): UpgradeToAndCallCall__Outputs {
    return new UpgradeToAndCallCall__Outputs(this);
  }
}

export class UpgradeToAndCallCall__Inputs {
  _call: UpgradeToAndCallCall;

  constructor(call: UpgradeToAndCallCall) {
    this._call = call;
  }

  get newImplementation(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get data(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }
}

export class UpgradeToAndCallCall__Outputs {
  _call: UpgradeToAndCallCall;

  constructor(call: UpgradeToAndCallCall) {
    this._call = call;
  }
}