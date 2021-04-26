import Big from "big.js"
import { useMemo, useState } from "react"
import { createContainer } from "unstated-next"

export const Trade = createContainer(useTrade)

function useTrade() {
    /* long = 1, short = 0 */
    const [side, setSide] = useState<0 | 1>(1)

    /* min: 1, max: 10 */
    const [leverage, setLeverage] = useState<number>(1)

    /* min: 0.1%, max: 1% */
    const [slippage, setSlippage] = useState<number>(0.5)

    const [margin, setMargin] = useState<Big | null>(null)

    return useMemo(
        () => ({
            side,
            setSide,
            leverage,
            setLeverage,
            slippage,
            setSlippage,
            margin,
            setMargin,
        }),
        [leverage, margin, side, slippage],
    )
}
