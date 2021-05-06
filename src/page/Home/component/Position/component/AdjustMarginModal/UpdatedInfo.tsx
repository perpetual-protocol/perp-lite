import { Heading, Box, Table, Tbody, Tr, Td } from "@chakra-ui/react"
import React from "react"

function UpdatedInfo() {
    return (
        <>
            <Heading w="full" size="sm">
                Updated Position
            </Heading>
            <Box width="100%" borderStyle="solid" borderWidth="1px" borderColor="gray.200" borderRadius="12px">
                <Table size="sm" borderRadius="12px" overflow="hidden" w="100%" variant="simple">
                    <Tbody>
                        <Tr>
                            <Td>Margin</Td>
                            <Td isNumeric>25.4</Td>
                        </Tr>
                        <Tr>
                            <Td>Margin Ratio</Td>
                            <Td isNumeric>-0.2%</Td>
                        </Tr>
                        <Tr>
                            <Td>Leverage</Td>
                            <Td isNumeric>4.4×</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Box>
        </>
    )
}

export default UpdatedInfo
