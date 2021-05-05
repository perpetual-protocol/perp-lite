import { Side, Dir } from "constant"
import { Amm } from "container/amm"
import { Trade } from "page/Home/container/trade"
import { useAmm } from "hook/useAmm"
import { useEffect, useState } from "react"
import Big from "big.js"
import { big2Decimal, decimal2Big, formatInput } from "util/format"
import { useDebounce } from "hook/useDebounce"

export function usePositionSize() {
    const { selectedAmm } = Amm.useContainer()
    const { collateral, leverage, side } = Trade.useContainer()
    const dir = side === Side.Long ? Dir.AddToAmm : Dir.RemoveFromAmm

    const ammAddress = selectedAmm?.address || ""
    const { contract } = useAmm(ammAddress)

    const [positionSize, setPositionSize] = useState<string>("")
    const [isCalculating, setIsCalculating] = useState<boolean>(false)

    const d_collateral = useDebounce({ value: collateral, delay: 500 })
    const d_leverage = useDebounce({ value: leverage, delay: 500 })

    /**
     * 1. trigger by user
     * 2. trigger by contract event
     */

    /* case1: trigger by user */
    useEffect(() => {
        async function updatePositionByUserControl() {
            if (d_collateral === "" || !contract) {
                setPositionSize("")
                return
            }

            /* early return if the collateral is zero */
            const _collateral = new Big(d_collateral)
            if (_collateral.eq(0)) {
                setPositionSize("0")
                return
            }

            setIsCalculating(true)

            /* calculate the position size */
            const notional = big2Decimal(_collateral.mul(d_leverage))
            const positionReceived = await contract.getInputPrice(dir, notional)
            const formattedValue = formatInput(decimal2Big(positionReceived).toString(), 3)

            setPositionSize(formattedValue)
            setIsCalculating(false)
        }
        updatePositionByUserControl()
    }, [contract, dir, d_collateral, d_leverage])

    return { positionSize, isCalculating, dir, d_collateral, d_leverage }
}
