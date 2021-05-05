import React, { useCallback } from "react"
import Big from "big.js"
import { Heading, VStack, Button, Box, Table, Tbody, Tr, Td, Text } from "@chakra-ui/react"
import { Amm } from "container/amm"
import { ClearingHouse } from "container/clearingHouse"
import { Transaction } from "container/transaction"
import { Trade } from "page/Home/container/trade"
import { Side } from "constant"
import { usePositionSize } from "./hook/usePositionSize"

function SendTxButton() {
    const { selectedAmm } = Amm.useContainer()
    const { slippage, side } = Trade.useContainer()
    const { openPosition } = ClearingHouse.useContainer()
    const { isLoading: isTxExecuting } = Transaction.useContainer()
    const { positionSize, dir, d_collateral, d_leverage, isCalculating } = usePositionSize()
    const ammAddress = selectedAmm?.address || ""

    const handleOnTrade = useCallback(async () => {
        const _collateral = new Big(d_collateral)
        const _positionSize = new Big(positionSize)
        const _leverage = new Big(d_leverage)
        const _slippage = slippage / 100
        const minPositionSizeReceived: Big =
            side === Side.Long ? _positionSize.mul(1 - _slippage) : _positionSize.mul(1 + _slippage)
        openPosition(dir, ammAddress, _collateral, _leverage, minPositionSizeReceived)
    }, [ammAddress, d_collateral, d_leverage, dir, openPosition, positionSize, side, slippage])

    return (
        <Button
            size="md"
            isLoading={isCalculating || isTxExecuting}
            isFullWidth
            colorScheme="blue"
            onClick={handleOnTrade}
        >
            Send Transaction
        </Button>
    )
}

function Summary() {
    return (
        <>
            <Heading w="full" size="md">
                Transaction Summary
            </Heading>

            <VStack spacing={2} width="full">
                <SendTxButton />
                <Text fontSize="sm" color="gray.500">
                    Confirm in Metamask
                </Text>
            </VStack>
            <Box width="100%" borderStyle="solid" borderWidth="1px" borderColor="gray.200" borderRadius="12px">
                <Table size="sm" borderRadius="12px" overflow="hidden" w="100%" variant="simple">
                    <Tbody>
                        <Tr>
                            <Td>Entry Price</Td>
                            <Td isNumeric>25.4</Td>
                        </Tr>
                        <Tr>
                            <Td>Price Impact</Td>
                            <Td isNumeric>-0.2%</Td>
                        </Tr>
                        <Tr>
                            <Td>Liquidation Price</Td>
                            <Td isNumeric>47.28</Td>
                        </Tr>
                        <Tr>
                            <Td>Transaction Fee</Td>
                            <Td isNumeric>0.91444</Td>
                        </Tr>
                        <Tr fontWeight="bold">
                            <Td>Total Cost</Td>
                            <Td isNumeric>0.91444</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Box>
        </>
    )
}

export default Summary
