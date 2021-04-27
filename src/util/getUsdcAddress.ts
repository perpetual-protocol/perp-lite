export function getUsdcAddressByConfig(config: any) {
    const externalContracts = config?.layers?.layer1?.externalContracts
    if (externalContracts) {
        /* use the tether token as the backup address */
        return externalContracts.usdc || externalContracts.tether
    }
}
