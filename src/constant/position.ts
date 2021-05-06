import Big from "big.js"
import { Amm } from "./amm"

export interface PositionInfo extends Amm {
    size: Big
}

export enum Side {
    Long = 1,
    Short = 0,
}

export enum MarginDir {
    Add,
    Reduce,
}
