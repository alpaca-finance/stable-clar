import { beforeEach, describe, expect, it } from "vitest";
import { SimpleOracleWrapper } from "./wrappers/simple_oracle";
import { sBTC_PRINCIPAL } from "./constants";
import { Cl } from "@stacks/transactions";

describe("simple oracle tests", () => {
  let simpleOracleAsDeployer: SimpleOracleWrapper;
  let simpleOracleAsFeeder: SimpleOracleWrapper;
  let simpleOracleAsAlice: SimpleOracleWrapper;

  let deployer: string;
  let feeder: string;
  let alice: string;

  beforeEach(() => {
    const accounts = simnet.getAccounts();

    deployer = accounts.get("deployer")!;
    feeder = accounts.get("wallet_1")!;
    alice = accounts.get("wallet_2")!;

    simpleOracleAsDeployer = new SimpleOracleWrapper(
      simnet,
      deployer,
      deployer
    );
    simpleOracleAsFeeder = new SimpleOracleWrapper(simnet, deployer, feeder);
    simpleOracleAsAlice = new SimpleOracleWrapper(simnet, deployer, alice);

    simpleOracleAsDeployer.setFeeder(feeder);
  });

  describe("when call set_price", () => {
    describe("when caller is not a feeder", () => {
      it("should error", async () => {
        expect(
          simpleOracleAsAlice.setPrice(sBTC_PRINCIPAL, "100000000")
        ).toBeErr(Cl.uint(403));
      });
    });

    describe("when caller is a feeder", () => {
      it("should set price", async () => {
        simpleOracleAsFeeder.setPrice(sBTC_PRINCIPAL, "100000000");
        expect(simpleOracleAsAlice.fetchPrice(sBTC_PRINCIPAL)).toBeOk(
          Cl.uint(100000000)
        );
      });
    });
  });
});
