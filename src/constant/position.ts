import Big from "big.js"
import { Amm } from "./amm"

export interface PositionInfo extends Amm {
    size: Big
}
