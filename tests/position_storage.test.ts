import { beforeEach, describe, expect, it } from "vitest";
import { PositionStorageWrapper } from "./wrappers/position_storage";
import { Cl } from "@stacks/transactions";

describe("position storage tests", () => {
  const accounts = simnet.getAccounts();

  let positionStorageAsDeployer: PositionStorageWrapper;
  let positionStorageAsAllowedCaller: PositionStorageWrapper;
  let positionStorageAsAlice: PositionStorageWrapper;

  let deployer: string;
  let allowedCaller: string;
  let alice: string;

  beforeEach(() => {
    deployer = accounts.get("deployer")!;
    allowedCaller = accounts.get("wallet_1")!;
    alice = accounts.get("wallet_2")!;

    positionStorageAsDeployer = new PositionStorageWrapper(
      simnet,
      deployer,
      deployer
    );
    positionStorageAsAllowedCaller = new PositionStorageWrapper(
      simnet,
      deployer,
      allowedCaller
    );
    positionStorageAsAlice = new PositionStorageWrapper(
      simnet,
      deployer,
      alice
    );

    positionStorageAsDeployer.setAllowCaller(allowedCaller, true);
  });

  describe("when call set-allow-caller", () => {
    describe("when caller is not an owner", () => {
      it("should error", async () => {
        expect(
          positionStorageAsAlice.setAllowCaller(allowedCaller, true)
        ).toBeErr(Cl.uint(403));
      });
    });

    describe("when caller is an owner", () => {
      it("should set allow caller", async () => {
        positionStorageAsDeployer.setAllowCaller(
          accounts.get("wallet_3")!,
          true
        );
        expect(
          positionStorageAsAlice.isAllowCaller(accounts.get("wallet_3")!)
        ).toBeOk(Cl.bool(true));
      });
    });
  });

  describe("when call set-position-status", () => {
    describe("when caller is not an allowed caller", () => {
      it("should error", async () => {
        expect(positionStorageAsAlice.setPositionStatus(alice, 1)).toBeErr(
          Cl.uint(403)
        );
      });
    });

    describe("when caller is an allowed caller", () => {
      it("should set position status", async () => {
        positionStorageAsAllowedCaller.setPositionStatus(alice, 1);
        expect(positionStorageAsAlice.getPosition(alice)).toBeOk(
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
});
