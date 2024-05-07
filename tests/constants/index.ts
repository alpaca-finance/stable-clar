const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;

export const sBTC_PRINCIPAL = `${deployer}.sbtc`;
