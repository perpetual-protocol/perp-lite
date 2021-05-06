import { Side, Dir } from "constant"
import { Amm } from "container/amm"
import { Trade } from "page/Home/container/trade"
import { useAmm } from "hook/useAmm"
import { useEffect, useState } from "react"
import Big from "big.js"
import { formatInput } from "util/format"
import { useDebounce } from "hook/useDebounce"

export function usePositionSize() {
    const { selectedAmm } = Amm.useContainer()
    const { collateral, leverage, side } = Trade.useContainer()
    const dir = side === Side.Long ? Dir.AddToAmm : Dir.RemoveFromAmm

    const ammAddress = selectedAmm?.address || ""
    const ammName = selectedAmm?.baseAssetSymbol || ""
    const { getInputPrice } = useAmm(ammAddress, ammName)

    const [positionSize, setPositionSize] = useState<string>("")
    const [isCalculating, setIsCalculating] = useState<boolean>(false)

    const debouncedCollateral = useDebounce({ value: collateral, delay: 500 })
    const debouncedLeverage = useDebounce({ value: leverage, delay: 500 })

    /**
     * 1. trigger by user
     * 2. trigger by contract event
     */

    /* case1: trigger by user */
    useEffect(() => {
        async function updatePositionByUserControl() {
            if (debouncedCollateral === "") {
                setPositionSize("")
                return
            }

            /* early return if the collateral is zero */
            const _collateral = new Big(debouncedCollateral)
            if (_collateral.eq(0)) {
                setPositionSize("0")
                return
            }

            setIsCalculating(true)

            /* calculate the position size */
            const notional = _collateral.mul(debouncedLeverage)
            const positionReceived = await getInputPrice(dir, notional)

            let formattedValue = ""
            if (positionReceived !== null) {
                formattedValue = formatInput(positionReceived.toString(), 3)
            }

            setPositionSize(formattedValue)
            setIsCalculating(false)
        }
        updatePositionByUserControl()
    }, [dir, debouncedCollateral, debouncedLeverage, getInputPrice])

    return { positionSize, isCalculating, dir, debouncedCollateral, debouncedLeverage }
}
