import { Simnet } from "@hirosystems/clarinet-sdk";
import { Cl, ClarityValue } from "@stacks/transactions";

export class SimpleOracleWrapper {
  simnet: Simnet;
  deployerAddress: string;
  contractName: string = "simple-oracle";
  caller: string;

  constructor(simnet: Simnet, deployerAddress: string, caller: string) {
    this.simnet = simnet;
    this.deployerAddress = deployerAddress;
    this.caller = caller;
  }

  setFeeder(feederPrincipal: string): ClarityValue {
    return this.simnet.callPublicFn(
      this.contractName,
      "set-feeder",
      [Cl.principal(feederPrincipal)],
      this.caller
    ).result;
  }

  setPrice(ftPricipal: string, price: string): ClarityValue {
    return this.simnet.callPublicFn(
      this.contractName,
      "set-price",
      [Cl.principal(ftPricipal), Cl.uint(price)],
      this.caller
    ).result;
  }

  fetchPrice(ftPrincipal: string): ClarityValue {
    return this.simnet.callReadOnlyFn(
      this.contractName,
      "fetch-price",
      [Cl.principal(ftPrincipal)],
      this.caller
    ).result;
  }
}
