import { Simnet } from "@hirosystems/clarinet-sdk";
import { Cl, ClarityValue } from "@stacks/transactions";

export class PositionStorageWrapper {
  simnet: Simnet;
  deployerAddress: string;
  contractName: string = "position_storage";
  caller: string;

  constructor(simnet: Simnet, deployerAddress: string, caller: string) {
    this.simnet = simnet;
    this.deployerAddress = deployerAddress;
    this.caller = caller;
  }

  setAllowCaller(callerPrincipal: string, isAllow: boolean): ClarityValue {
    return this.simnet.callPublicFn(
      this.contractName,
      "set-allow-caller",
      [Cl.principal(callerPrincipal), Cl.bool(isAllow)],
      this.caller
    ).result;
  }

  isAllowCaller(callerPrincipal: string): ClarityValue {
    return this.simnet.callReadOnlyFn(
      this.contractName,
      "is-allow-caller",
      [Cl.principal(callerPrincipal)],
      this.caller
    ).result;
  }

  setPositionStatus(borrower: string, status: number): ClarityValue {
    return this.simnet.callPublicFn(
      this.contractName,
      "set-position-status",
      [Cl.principal(borrower), Cl.uint(status)],
      this.caller
    ).result;
  }

  getPosition(borrower: string): ClarityValue {
    return this.simnet.callReadOnlyFn(
      this.contractName,
      "get-position",
      [Cl.principal(borrower)],
      this.caller
    ).result;
  }
}
