export interface Amm {
    address: string
    baseAssetSymbol: string
    quoteAssetSymbol: string
}

export enum Dir {
    AddToAmm = 0,
    RemoveFromAmm = 1,
}
