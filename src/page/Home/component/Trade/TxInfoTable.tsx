import { Table, Tbody, Tr, Td } from "@chakra-ui/react"
import Big from "big.js"
import { Amm } from "container/amm"
import { Trade } from "container/trade"
import { useAmm } from "hook/useAmm"
import { useMemo } from "react"
import { numberWithCommasUsdc } from "util/format"
import { usePositionSize } from "./hook/usePositionSize"

function TxInfoTable() {
    const { selectedAmm } = Amm.useContainer()
    const { collateral, leverage } = Trade.useContainer()
    const { positionSize, isCalculating } = usePositionSize()

    const ammAddress = selectedAmm?.address || ""
    const ammName = selectedAmm?.baseAssetSymbol || ""
    const { quoteAssetReserve, baseAssetReserve } = useAmm(ammAddress, ammName)

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
        if (collateral !== null && selectedAmm !== null) {
            const { tollRatio, spreadRatio } = selectedAmm
            const notional = collateral.mul(leverage)
            const tollFee = notional.mul(tollRatio)
            const spreadFee = notional.mul(spreadRatio)
            return numberWithCommasUsdc(tollFee.add(spreadFee))
        }
        return "-"
    }, [collateral, leverage, selectedAmm])

    const totalStr = useMemo(() => {}, [])

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
                    <Td isNumeric>0.91444</Td>
                </Tr>
            </Tbody>
        </Table>
    )
}

export default TxInfoTable
