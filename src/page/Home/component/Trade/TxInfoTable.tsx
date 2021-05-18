import { Table, Tbody, Td, Tr } from "@chakra-ui/react"

import { Amm } from "container/amm"
import Big from "big.js"
import { Side } from "constant"
import { Trade } from "container/trade"
import { numberWithCommasUsdc } from "util/format"
import { useMemo } from "react"
import { useOpenedPositionSize } from "./useOpenedPositionSize"
import { usePositionSize } from "./usePositionSize"
import { useRealtimeAmm } from "hook/useRealtimeAmm"

function TxInfoTable() {
    const { selectedAmm } = Amm.useContainer()
    const { collateral, leverage, side } = Trade.useContainer()
    const { positionSize, isCalculating } = usePositionSize()

    const ammAddress = selectedAmm?.address || ""
    const ammName = selectedAmm?.baseAssetSymbol || ""
    const { quoteAssetReserve, baseAssetReserve } = useRealtimeAmm(ammAddress, ammName)
    const { size: openedSize, margin: openedMargin, unrealizedPnl, outputPrice } = useOpenedPositionSize(ammAddress)

    /* prepare data for UI */
    const entryPrice: Big | null = useMemo(() => {
        if (!isCalculating && positionSize !== "" && collateral !== null) {
            const b_positionSize = new Big(positionSize)
            if (b_positionSize.eq(0)) {
                return null
            }
            return collateral.mul(leverage).div(b_positionSize)
        }
        return null
    }, [collateral, isCalculating, leverage, positionSize])

    const fee: Big | null = useMemo(() => {
        if (collateral !== null && selectedAmm !== null) {
            const { tollRatio, spreadRatio } = selectedAmm
            const notional = collateral.mul(leverage)
            const tollFee = notional.mul(tollRatio)
            const spreadFee = notional.mul(spreadRatio)
            return tollFee.add(spreadFee)
        }
        return null
    }, [collateral, leverage, selectedAmm])

    const entryPriceStr = useMemo(() => {
        if (entryPrice !== null) {
            return numberWithCommasUsdc(entryPrice)
        }
        return "-"
    }, [entryPrice])

    const priceImpactStr = useMemo(() => {
        if (entryPrice !== null && quoteAssetReserve !== null && baseAssetReserve !== null) {
            const spotPrice = quoteAssetReserve.div(baseAssetReserve)
            if (spotPrice.eq(0)) {
                return "-"
            }
            return entryPrice.sub(spotPrice).div(spotPrice).mul(100).toFixed(2)
        }
        return "-"
    }, [entryPrice, quoteAssetReserve, baseAssetReserve])

    const feeStr = useMemo(() => {
        if (fee !== null) {
            return numberWithCommasUsdc(fee)
        }
        return "-"
    }, [fee])

    const totalStr = useMemo(() => {
        /* TODO: positionSize should only be null or Big */
        if (collateral !== null && fee !== null && positionSize !== "") {
            if (
                openedMargin !== null &&
                openedSize !== null &&
                outputPrice !== null &&
                unrealizedPnl !== null &&
                !openedSize.eq(0) &&
                side !== (openedSize.gt(0) ? Side.Long : Side.Short)
            ) {
                const b_positionSize = new Big(positionSize)
                if (b_positionSize.gt(openedSize.abs())) {
                    /** case:
                     * open an "opposite side" position
                     * and the "open size" is "bigger" than the "existing position" size */
                    /**
                     * collateralToPay
                     * = collateral - remainMargin
                     * = (positionNotionalDiff / leverage) - remainMargin
                     * = (newPositionNotional - oldPositionNotional) / leverage - remainMargin
                     * = collateral - (oldPositionNotional / leverage) - remainMargin
                     */
                    const remainMargin = openedMargin.add(unrealizedPnl)
                    const collateralToPay = collateral.sub(outputPrice.div(leverage)).sub(remainMargin)
                    return numberWithCommasUsdc(fee.add(collateralToPay))
                } else {
                    /** case:
                     * open an "opposite side" position
                     * and the "open size" is "small or equal" to the "existing position" size */
                    return numberWithCommasUsdc(fee)
                }
            } else {
                /** case:
                 * no existing position
                 * or open a "same side" position
                 */
                return numberWithCommasUsdc(fee.add(collateral))
            }
        }
        return "-"
    }, [collateral, fee, leverage, openedMargin, openedSize, outputPrice, positionSize, side, unrealizedPnl])

    return (
        <Table size="sm" borderRadius="12px" overflow="hidden" w="100%" variant="simple">
            <Tbody>
                <Tr>
                    <Td>Entry Price</Td>
                    <Td isNumeric>{entryPriceStr}</Td>
                </Tr>
                <Tr>
                    <Td>Price Impact</Td>
                    <Td isNumeric>{priceImpactStr}%</Td>
                </Tr>
                {/* <Tr>
                    <Td>Liquidation Price</Td>
                    <Td isNumeric>47.28</Td>
                </Tr> */}
                <Tr>
                    <Td>Transaction Fee</Td>
                    <Td isNumeric>{feeStr}</Td>
                </Tr>
                <Tr fontWeight="bold">
                    <Td>Total Cost</Td>
                    <Td isNumeric>{totalStr}</Td>
                </Tr>
            </Tbody>
        </Table>
    )
}

export default TxInfoTable
