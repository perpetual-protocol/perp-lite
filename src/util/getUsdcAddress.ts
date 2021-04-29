export function getXDaiUsdcAddress(config: any) {
    const externalContracts = config?.layers?.layer2?.externalContracts
    if (externalContracts) {
        /* use the tether token as the backup address */
        return externalContracts.usdc || externalContracts.tether
    }
}
