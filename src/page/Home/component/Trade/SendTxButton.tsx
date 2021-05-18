import { Amm } from "container/amm"
import Big from "big.js"
import { Button } from "@chakra-ui/react"
import { ClearingHouse } from "container/clearingHouse"
import { Side } from "constant"
import { Trade } from "container/trade"
import { Transaction } from "container/transaction"
import { isAddress } from "ethers/lib/utils"
import { useCallback } from "react"
import { usePositionSize } from "./usePositionSize"

function SendTxButton() {
    const { selectedAmm } = Amm.useContainer()
    const { slippage, side, collateral, leverage } = Trade.useContainer()
    const { openPosition } = ClearingHouse.useContainer()
    const { isLoading: isTxExecuting } = Transaction.useContainer()
    const { positionSize, dir, isCalculating } = usePositionSize()
    const ammAddress = selectedAmm?.address || ""

    const isDisabled = isTxExecuting || isCalculating || collateral === null || collateral.eq(0)

    const handleOnTrade = useCallback(async () => {
        if (collateral && isAddress(ammAddress)) {
            const _positionSize = new Big(positionSize)
            const _leverage = new Big(leverage)
            const _slippage = slippage / 100
            const minPositionSizeReceived: Big =
                side === Side.Long ? _positionSize.mul(1 - _slippage) : _positionSize.mul(1 + _slippage)
            openPosition(dir, ammAddress, collateral, _leverage, minPositionSizeReceived)
        }
    }, [ammAddress, collateral, leverage, dir, openPosition, positionSize, side, slippage])

    return (
        <Button
            size="md"
            disabled={isDisabled}
            isLoading={isTxExecuting}
            isFullWidth
            colorScheme="blue"
            onClick={handleOnTrade}
        >
            Send Transaction
        </Button>
    )
}

export default SendTxButton
