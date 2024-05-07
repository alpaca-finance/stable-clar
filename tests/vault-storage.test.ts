import { beforeEach, describe, expect, it } from "vitest";
import { VaultStorageWrapper } from "./wrappers/vault-storage";
import { Cl } from "@stacks/transactions";

describe("vault storage tests", () => {
  const accounts = simnet.getAccounts();

  let vaultStorageAsDeployer: VaultStorageWrapper;
  let vaultStorageAsAllowedCaller: VaultStorageWrapper;
  let vaultStorageAsAlice: VaultStorageWrapper;

  let deployer: string;
  let allowedCaller: string;
  let alice: string;

  beforeEach(() => {
    deployer = accounts.get("deployer")!;
    allowedCaller = accounts.get("wallet_1")!;
    alice = accounts.get("wallet_2")!;

    vaultStorageAsDeployer = new VaultStorageWrapper(
      simnet,
      deployer,
      deployer
    );
    vaultStorageAsAllowedCaller = new VaultStorageWrapper(
      simnet,
      deployer,
      allowedCaller
    );
    vaultStorageAsAlice = new VaultStorageWrapper(simnet, deployer, alice);

    vaultStorageAsDeployer.setAllowCaller(allowedCaller, true);
  });

  describe("when call set-allow-caller", () => {
    describe("when caller is not an owner", () => {
      it("should error", async () => {
        expect(vaultStorageAsAlice.setAllowCaller(allowedCaller, true)).toBeErr(
          Cl.uint(2002)
        );
      });
    });

    describe("when caller is an owner", () => {
      it("should set allow caller", async () => {
        vaultStorageAsDeployer.setAllowCaller(accounts.get("wallet_3")!, true);
        expect(
          vaultStorageAsAlice.isAllowCaller(accounts.get("wallet_3")!)
        ).toBeOk(Cl.bool(true));
      });
    });
  });

  describe("when call set-vault-status", () => {
    describe("when caller is not an allowed caller", () => {
      it("should error", async () => {
        expect(vaultStorageAsAlice.setVaultStatus(alice, 1)).toBeErr(
          Cl.uint(2002)
        );
      });
    });

    describe("when caller is an allowed caller", () => {
      it("should set vault status", async () => {
        vaultStorageAsAllowedCaller.setVaultStatus(alice, 1);
        expect(vaultStorageAsAlice.getVault(alice)).toBeOk(
          Cl.tuple({
            arrayIndex: Cl.uint(0),
            collateral: Cl.uint(0),
            debt: Cl.uint(0),
            status: Cl.uint(1),
          })
        );
      });
    });
  });

  describe("when call increase-collateral", () => {
    describe("when caller is not an allowed caller", () => {
      it("should error", async () => {
        expect(vaultStorageAsAlice.increaseCollateral(alice, 100)).toBeErr(
          Cl.uint(2002)
        );
      });
    });

    describe("when caller is an allowed caller", () => {
      it("should increase collateral", async () => {
        expect(
          vaultStorageAsAllowedCaller.increaseCollateral(alice, 100)
        ).toBeOk(Cl.bool(true));
        expect(vaultStorageAsAlice.getVault(alice)).toBeOk(
          Cl.tuple({
            arrayIndex: Cl.uint(0),
            collateral: Cl.uint(100),
            debt: Cl.uint(0),
            status: Cl.uint(0),
          })
        );
      });
    });
  });

  describe("when call increase-debt", () => {
    describe("when caller is not an allowed caller", () => {
      it("should error", async () => {
        expect(vaultStorageAsAlice.increaseDebt(alice, 100)).toBeErr(
          Cl.uint(2002)
        );
      });
    });

    describe("when caller is an allowed caller", () => {
      it("should increase debt", async () => {
        expect(
          vaultStorageAsAllowedCaller.increaseCollateral(alice, 100)
        ).toBeOk(Cl.bool(true));
        expect(vaultStorageAsAllowedCaller.increaseDebt(alice, 100)).toBeOk(
          Cl.bool(true)
        );
        expect(vaultStorageAsAlice.getVault(alice)).toBeOk(
          Cl.tuple({
            arrayIndex: Cl.uint(0),
            collateral: Cl.uint(100),
            debt: Cl.uint(100),
            status: Cl.uint(0),
          })
        );
      });
    });
  });
});
