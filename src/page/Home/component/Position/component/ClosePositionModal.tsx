import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    VStack,
    Heading,
    Box,
    Table,
    Tbody,
    Tr,
    Td,
    Divider,
    ModalFooter,
    Button,
} from "@chakra-ui/react"
import React, { useCallback } from "react"
import { PositionInfo } from "constant/position"
import { ClearingHouse } from "container/clearingHouse"
import { Trade } from "page/Home/container/trade"
import { useAmm } from "hook/useAmm"
import { Dir } from "constant"
import { big2Decimal, decimal2Big } from "util/format"
import Big from "big.js"

interface ClosePositionModalProps {
    data: PositionInfo
    isOpen: boolean
    onClose: () => void
}

function ClosePositionModal({ data, isOpen, onClose }: ClosePositionModalProps) {
    const { slippage } = Trade.useContainer()
    const { closePosition } = ClearingHouse.useContainer()
    const { address, size } = data
    const { contract } = useAmm(address)

    const handleOnClick = useCallback(async () => {
        if (contract) {
            const dir: Dir = size.gt(0) ? Dir.AddToAmm : Dir.RemoveFromAmm
            const notional: Big = decimal2Big(await contract.getOutputPrice(dir, big2Decimal(size.abs())))
            const slippageLimit = notional.mul(slippage / 100)
            const quoteLimit = size.gt(0) ? notional.sub(slippageLimit) : notional.add(slippageLimit)
            closePosition(address, quoteLimit)
        }
    }, [address, closePosition, contract, size, slippage])

    return (
        <Modal isCentered motionPreset="slideInBottom" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent borderRadius="2xl" pb={3}>
                <ModalHeader>Close Position</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={5}>
                        <Heading w="full" size="sm">
                            Transaction Summary
                        </Heading>
                        <Box
                            width="100%"
                            borderStyle="solid"
                            borderWidth="1px"
                            borderColor="gray.200"
                            borderRadius="12px"
                        >
                            <Table size="sm" borderRadius="12px" overflow="hidden" w="100%" variant="simple">
                                <Tbody>
                                    <Tr fontWeight="bold">
                                        <Td>Exit Price</Td>
                                        <Td isNumeric>5.35473 USDC</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Margin</Td>
                                        <Td isNumeric>1,157.88 USDC</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>PnL</Td>
                                        <Td isNumeric>-67.62 USDC</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Transaction Fee</Td>
                                        <Td isNumeric>-4.57 USDC</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Total Value Received</Td>
                                        <Td isNumeric>1,083.48 USDC</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </Box>
                        <Divider />
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button isFullWidth colorScheme="blue" size="md" onClick={handleOnClick}>
                        Close Position
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ClosePositionModal
