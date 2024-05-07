import { beforeEach, describe, expect, it } from "vitest";
import { SimpleOracleWrapper } from "./wrappers/simple-oracle";
import { VaultStorageWrapper } from "./wrappers/vault-storage";
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

  let vaultStorageAsDeployer: VaultStorageWrapper;

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

    vaultStorageAsDeployer = new VaultStorageWrapper(
      simnet,
      deployer,
      deployer
    );

    userEntryAsAlice = new UserEntryWrapper(simnet, deployer, alice);

    expect(
      vaultStorageAsDeployer.setAllowCaller(
        userEntryAsAlice.getContractPrincipal(),
        true
      )
    ).toBeOk(Cl.bool(true));
    expect(
      configStorageAsDeployer.initialize(
        simpleOracleAsDeployer.getContractPrincipal(),
        vaultStorageAsDeployer.getContractPrincipal(),
        sBTC_PRINCIPAL
      )
    ).toBeOk(Cl.bool(true));

    simpleOracleAsFeeder.setPrice(sBTC_PRINCIPAL, String(200 * 1e8));
  });

  describe("when new vault", () => {
    describe("when injected incorrect dependency", () => {
      describe("when injected fake oracle", () => {
        it("should error", async () => {
          expect(
            userEntryAsAlice.newVault(
              `${deployer}.fake-simple-oracle`,
              vaultStorageAsDeployer.getContractPrincipal(),
              sBTC_PRINCIPAL,
              100,
              100
            )
          ).toBeErr(Cl.uint(1001));
        });
      });

      describe("when injected fake vault storage", () => {
        it("should error", async () => {
          expect(
            userEntryAsAlice.newVault(
              simpleOracleAsDeployer.getContractPrincipal(),
              `${deployer}.fake-vault-storage`,
              sBTC_PRINCIPAL,
              100,
              100
            )
          ).toBeErr(Cl.uint(1002));
        });
      });

      describe("when injected fake collateral", () => {
        it("should error", async () => {
          expect(
            userEntryAsAlice.newVault(
              simpleOracleAsDeployer.getContractPrincipal(),
              vaultStorageAsDeployer.getContractPrincipal(),
              `${deployer}.fake-sbtc`,
              100,
              100
            )
          ).toBeErr(Cl.uint(1003));
        });
      });
    });

    describe("when injected correct dependency", () => {
      it("should create new vault", async () => {
        expect(
          userEntryAsAlice.newVault(
            simpleOracleAsDeployer.getContractPrincipal(),
            vaultStorageAsDeployer.getContractPrincipal(),
            sBTC_PRINCIPAL,
            100,
            100
          )
        ).toBeOk(Cl.bool(true));

        expect(vaultStorageAsDeployer.getVault(alice)).toBeOk(
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
