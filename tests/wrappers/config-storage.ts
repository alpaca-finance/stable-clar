import { Simnet } from "@hirosystems/clarinet-sdk";
import { Cl, ClarityValue } from "@stacks/transactions";

export class ConfigStorageWrapper implements WrapperInterface {
  simnet: Simnet;
  deployerAddress: string;
  contractName: string = "config-storage";
  caller: string;

  constructor(simnet: Simnet, deployerAddress: string, caller: string) {
    this.simnet = simnet;
    this.deployerAddress = deployerAddress;
    this.caller = caller;
  }

  getContractPrincipal(): string {
    return `${this.deployerAddress}.${this.contractName}`;
  }

  initialize(
    oraclePrincipal: string,
    vaultStoragePrincipal: string,
    collateralPrincipal: string,
    stablecoinPrincipal: string
  ): ClarityValue {
    return simnet.callPublicFn(
      this.contractName,
      "initialize",
      [
        Cl.principal(oraclePrincipal),
        Cl.principal(vaultStoragePrincipal),
        Cl.principal(collateralPrincipal),
        Cl.principal(stablecoinPrincipal),
      ],
      this.caller
    ).result;
  }
}
