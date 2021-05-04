import { Big } from "big.js"
import { BigNumber } from "ethers"

export const ERC20_DECIMAL_DIGITS = 18
export const QUOTE_ASSET_DIGITS = 2
export const FIXED_PRECISION = 2

export const BIG_ZERO = new Big(0)

export interface Decimal {
    d: BigNumber
}
