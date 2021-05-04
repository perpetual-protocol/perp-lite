export interface Amm {
    address: string
    baseAssetSymbol: string
    quoteAssetSymbol: string
}

export enum Dir {
    ADD_TO_AMM = "0",
    REMOVE_FROM_AMM = "1",
}
