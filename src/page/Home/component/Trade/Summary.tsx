import { Heading, VStack, Button, Box, Table, Tbody, Tr, Td, Text } from "@chakra-ui/react"
import React from "react"

function Summary() {
    return (
        <>
            <Heading w="full" size="md">
                Transaction Summary
            </Heading>

            <VStack spacing={2} width="full">
                <Button size="md" isFullWidth colorScheme="blue">
                    Send Transaction
                </Button>
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
