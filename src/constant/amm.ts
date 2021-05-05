export interface Amm {
    address: string
    baseAssetSymbol: string
    quoteAssetSymbol: string
}

export enum Dir {
    AddToAMM = "0",
    RemoveFromAMM = "1",
}
