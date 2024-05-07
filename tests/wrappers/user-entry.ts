import { Simnet } from "@hirosystems/clarinet-sdk";
import { Cl } from "@stacks/transactions";

export class UserEntryWrapper implements WrapperInterface {
  simnet: Simnet;
  deployerAddress: string;
  contractName: string = "user-entry";
  caller: string;

  constructor(simnet: Simnet, deployerAddress: string, caller: string) {
    this.simnet = simnet;
    this.deployerAddress = deployerAddress;
    this.caller = caller;
  }

  getContractPrincipal(): string {
    return `${this.deployerAddress}.${this.contractName}`;
  }

  newVault(
    oraclePrincipal: string,
    vaultStoragePrincipal: string,
    collateralPrincipal: string,
    stablecoinPrincipal: string,
    collateralAmount: number,
    stablecoinAmount: number
  ) {
    return this.simnet.callPublicFn(
      this.contractName,
      "new-vault",
      [
        Cl.principal(oraclePrincipal),
        Cl.principal(vaultStoragePrincipal),
        Cl.principal(collateralPrincipal),
        Cl.principal(stablecoinPrincipal),
        Cl.uint(collateralAmount),
        Cl.uint(stablecoinAmount),
      ],
      this.caller
    ).result;
  }
}
