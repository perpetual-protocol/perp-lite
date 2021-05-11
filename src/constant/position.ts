import Big from "big.js"
import { Amm } from "./amm"

export interface PositionInfo extends Amm {
    unrealizedPnl: Big
    size: Big
    margin: Big
    openNotional: Big
    marginRatio: Big
}

export enum Side {
    Long = 1,
    Short = 0,
}

export enum MarginDir {
    Add,
    Reduce,
}

export enum PnlCalcOption {
    SpotPrice,
    Twap,
}
