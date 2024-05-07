import { beforeEach, describe, expect, it } from "vitest";
import { SimpleOracleWrapper } from "./wrappers/simple-oracle";
import { PositionStorageWrapper } from "./wrappers/position-storage";
import { UserEntryWrapper } from "./wrappers/user-entry";
import { Cl } from "@stacks/transactions";
import { ConfigStorageWrapper } from "./wrappers/config-storage";
import { sBTC_PRINCIPAL } from "./constants";

/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/clarinet/feature-guides/test-contract-with-clarinet-sdk
*/

describe("user entry tests", () => {
  const accounts = simnet.getAccounts();

  let simpleOracleAsDeployer: SimpleOracleWrapper;
  let simpleOracleAsFeeder: SimpleOracleWrapper;

  let configStorageAsDeployer: ConfigStorageWrapper;

  let positionStorageAsDeployer: PositionStorageWrapper;

  let userEntryAsAlice: UserEntryWrapper;

  let deployer: string;
  let feeder: string;
  let alice: string;

  beforeEach(() => {
    deployer = accounts.get("deployer")!;
    feeder = accounts.get("wallet_1")!;
    alice = accounts.get("wallet_2")!;

    simpleOracleAsDeployer = new SimpleOracleWrapper(
      simnet,
      deployer,
      deployer
    );
    simpleOracleAsFeeder = new SimpleOracleWrapper(simnet, deployer, feeder);
    expect(simpleOracleAsDeployer.setFeeder(feeder)).toBeOk(Cl.bool(true));

    configStorageAsDeployer = new ConfigStorageWrapper(
      simnet,
      deployer,
      deployer
    );

    positionStorageAsDeployer = new PositionStorageWrapper(
      simnet,
      deployer,
      deployer
    );

    userEntryAsAlice = new UserEntryWrapper(simnet, deployer, alice);

    expect(
      positionStorageAsDeployer.setAllowCaller(
        userEntryAsAlice.getContractPrincipal(),
        true
      )
    ).toBeOk(Cl.bool(true));
    expect(
      configStorageAsDeployer.initialize(
        simpleOracleAsDeployer.getContractPrincipal(),
        positionStorageAsDeployer.getContractPrincipal(),
        sBTC_PRINCIPAL
      )
    ).toBeOk(Cl.bool(true));

    simpleOracleAsFeeder.setPrice(sBTC_PRINCIPAL, String(200 * 1e8));
  });

  describe("when new position", () => {
    describe("when injected incorrect dependency", () => {
      describe("when injected fake oracle", () => {
        it("should error", async () => {
          expect(
            userEntryAsAlice.newPosition(
              `${deployer}.fake-simple-oracle`,
              positionStorageAsDeployer.getContractPrincipal(),
              sBTC_PRINCIPAL,
              100,
              100
            )
          ).toBeErr(Cl.uint(401));
        });
      });

      describe("when injected fake position storage", () => {
        it("should error", async () => {
          expect(
            userEntryAsAlice.newPosition(
              simpleOracleAsDeployer.getContractPrincipal(),
              `${deployer}.fake-position-storage`,
              sBTC_PRINCIPAL,
              100,
              100
            )
          ).toBeErr(Cl.uint(402));
        });
      });

      describe("when injected fake collateral", () => {
        it("should error", async () => {
          expect(
            userEntryAsAlice.newPosition(
              simpleOracleAsDeployer.getContractPrincipal(),
              positionStorageAsDeployer.getContractPrincipal(),
              `${deployer}.fake-sbtc`,
              100,
              100
            )
          ).toBeErr(Cl.uint(403));
        });
      });
    });

    describe("when injected correct dependency", () => {
      it("should create new position", async () => {
        expect(
          userEntryAsAlice.newPosition(
            simpleOracleAsDeployer.getContractPrincipal(),
            positionStorageAsDeployer.getContractPrincipal(),
            sBTC_PRINCIPAL,
            100,
            100
          )
        ).toBeOk(Cl.bool(true));

        expect(positionStorageAsDeployer.getPosition(alice)).toBeOk(
          Cl.tuple({
            arrayIndex: Cl.uint(0),
            collateral: Cl.uint(100),
            debt: Cl.uint(100),
            status: Cl.uint(1),
          })
        );
      });
    });
  });
});
