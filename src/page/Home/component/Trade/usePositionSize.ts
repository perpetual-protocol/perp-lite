import { Dir, Side } from "constant"
import { useEffect, useState } from "react"

import { Amm } from "container/amm"
import { Trade } from "container/trade"
import { formatInput } from "util/format"
import { useRealtimeAmm } from "hook/useRealtimeAmm"

export function usePositionSize() {
    const { selectedAmm } = Amm.useContainer()
    const { collateral, leverage, side } = Trade.useContainer()
    const dir = side === Side.Long ? Dir.AddToAmm : Dir.RemoveFromAmm

    const ammAddress = selectedAmm?.address || ""
    const ammName = selectedAmm?.baseAssetSymbol || ""
    const { getInputPrice } = useRealtimeAmm(ammAddress, ammName)

    const [positionSize, setPositionSize] = useState<string>("")
    const [isCalculating, setIsCalculating] = useState<boolean>(false)

    /**
     * 1. trigger by user
     * 2. trigger by contract event
     */

    /* case1: trigger by user */
    useEffect(() => {
        async function updatePositionByUserControl() {
            if (collateral === null) {
                setPositionSize("")
                return
            }

            /* early return if the collateral is zero */
            if (collateral.eq(0)) {
                setPositionSize("0")
                return
            }

            setIsCalculating(true)

            /* calculate the position size */
            const notional = collateral.mul(leverage)
            const positionReceived = await getInputPrice(dir, notional)

            let formattedValue = ""
            if (positionReceived !== null) {
                formattedValue = formatInput(positionReceived.toString(), 7)
            }

            setPositionSize(formattedValue)
            setIsCalculating(false)
        }
        updatePositionByUserControl()
    }, [dir, getInputPrice, collateral, leverage])

    return { positionSize, isCalculating, dir }
}
