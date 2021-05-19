import { ERC20_DECIMAL_DIGITS, USDC_PRECISION } from "../constant/number"

import Big from "big.js"
import { BigNumber } from "ethers"
import { formatUnits } from "ethers/lib/utils"

export interface Decimal {
    d: BigNumber
}

// Big Number to...
export function bigNum2FixedStr(
    val: BigNumber,
    decimals: number = ERC20_DECIMAL_DIGITS,
    digits: number = USDC_PRECISION,
): string {
    return Number.parseFloat(formatUnits(val, decimals)).toFixed(digits)
}

export function bigNum2Big(val: BigNumber, decimals: number = ERC20_DECIMAL_DIGITS): Big {
    return new Big(val.toString()).div(new Big(10).pow(decimals))
}

export function bigNum2Decimal(val: BigNumber): Decimal {
    return { d: val }
}

// Big to...
export function big2BigNum(val: Big, decimals: number = ERC20_DECIMAL_DIGITS): BigNumber {
    return BigNumber.from(val.mul(new Big(10).pow(decimals)).toFixed(0))
}

export function big2Decimal(val: Big): Decimal {
    return {
        d: big2BigNum(val, ERC20_DECIMAL_DIGITS),
    }
}

// Decimal to...
export function decimal2Big(decimal: Decimal): Big {
    return bigNum2Big(decimal.d)
}

// check regex 101 online, https://regex101.com/r/EeneAE/1
// to understand this regex
const regexUSLocaleNumber = new RegExp(/\d(?=(\d{3})+\.)/g)

// format number like 1000 => 1,000
export function numberWithCommas(number: string = "") {
    return number.replace(regexUSLocaleNumber, "$&,")
}

export function numberWithCommasUsdc(number: Big = new Big(0)) {
    return numberWithCommas(number.toFixed(USDC_PRECISION))
}

// TODO: check is valid number
// TODO: check is positive
// TODO: use in slippage if possible
// ex: if the input is 1.005 and the digits is 2, the function will return 1.00
export function formatInput(input: string, digits: number): string {
    const firstDotIndex = input.indexOf(".")
    const formattedString = input
        .split("")
        .filter((alphabet, index) => {
            return alphabet !== "." || index === firstDotIndex
        })
        .join("")
    return formattedString.includes(".") && formattedString.length > formattedString.indexOf(".") + (digits + 1)
        ? formattedString.substr(0, formattedString.indexOf(".") + (digits + 1))
        : formattedString
}
