import { Simnet } from "@hirosystems/clarinet-sdk";
import { Cl, ClarityValue } from "@stacks/transactions";

export class StablecoinWrapper {
  simnet: Simnet;
  deployerAddress: string;
  contractName: string = "stablecoin";
  caller: string;

  constructor(simnet: Simnet, deployerAddress: string, caller: string) {
    this.simnet = simnet;
    this.deployerAddress = deployerAddress;
    this.caller = caller;
  }

  getContractPrincipal(): string {
    return `${this.deployerAddress}.${this.contractName}`;
  }

  setMinter(minterPrincipal: string, isAllow: boolean): ClarityValue {
    return this.simnet.callPublicFn(
      this.contractName,
      "set-minter",
      [Cl.principal(minterPrincipal), Cl.bool(isAllow)],
      this.caller
    ).result;
  }
}
