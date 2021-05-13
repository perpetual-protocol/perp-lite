import Big from "big.js"

export interface Amm {
    address: string
    baseAssetSymbol: string
    quoteAssetSymbol: string
    tradeLimitRatio: Big
    tollRatio: Big
    spreadRatio: Big
}

export enum Dir {
    AddToAmm = 0,
    RemoveFromAmm = 1,
}
