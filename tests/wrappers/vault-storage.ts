import { Simnet } from "@hirosystems/clarinet-sdk";
import { Cl, ClarityValue } from "@stacks/transactions";

export class VaultStorageWrapper implements WrapperInterface {
  simnet: Simnet;
  deployerAddress: string;
  contractName: string = "vault-storage";
  caller: string;

  constructor(simnet: Simnet, deployerAddress: string, caller: string) {
    this.simnet = simnet;
    this.deployerAddress = deployerAddress;
    this.caller = caller;
  }

  getContractPrincipal(): string {
    return `${this.deployerAddress}.${this.contractName}`;
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

  setVaultStatus(borrower: string, status: number): ClarityValue {
    return this.simnet.callPublicFn(
      this.contractName,
      "set-vault-status",
      [Cl.principal(borrower), Cl.uint(status)],
      this.caller
    ).result;
  }

  getVault(borrower: string): ClarityValue {
    return this.simnet.callReadOnlyFn(
      this.contractName,
      "get-vault",
      [Cl.principal(borrower)],
      this.caller
    ).result;
  }

  increaseCollateral(who: string, amount: number): ClarityValue {
    return this.simnet.callPublicFn(
      this.contractName,
      "increase-collateral",
      [Cl.principal(who), Cl.uint(amount)],
      this.caller
    ).result;
  }

  increaseDebt(who: string, amount: number): ClarityValue {
    return this.simnet.callPublicFn(
      this.contractName,
      "increase-debt",
      [Cl.principal(who), Cl.uint(amount)],
      this.caller
    ).result;
  }
}
