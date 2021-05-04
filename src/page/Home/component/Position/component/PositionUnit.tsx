import { Badge, Box, Button, Heading, HStack, SimpleGrid, Spacer, Stack } from "@chakra-ui/react"
import React from "react"
import DataUnit from "./DataUnit"
import { PositionInfo } from "constant/position"
import { formatInput } from "util/format"

interface PositionUnitProps {
    data: PositionInfo
}

function PositionUnit({ data }: PositionUnitProps) {
    const { baseAssetSymbol, size } = data
    const isLongSide = size.gte(0)
    const positionSize = formatInput(size.toString(), 4)
    return (
        <Box>
            <Stack direction="column" spacing={4} borderRadius="2xl" borderWidth="1px" borderColor="gray.200" p={6}>
                <HStack>
                    <Heading size="md">{baseAssetSymbol}</Heading>
                    <Badge colorScheme={isLongSide ? "green" : "red"}>{isLongSide ? "Long" : "Short"}</Badge>
                </HStack>
                <SimpleGrid minChildWidth={["40%", "30%", "20%"]} spacing={4}>
                    {/* <DataUnit label="PnL" value="+129" /> */}
                    <DataUnit label="Position Size" value={positionSize} />
                    {/* <DataUnit label="Leverage" value="1.4×" />
                    <DataUnit label="Entry Price" value="1,398" />
                    <DataUnit label="Est.Liq.Price" value="943" />
                    <DataUnit label="Margin" value="53,292" />
                    <DataUnit label="Margin Ratio" value="40%" /> */}
                </SimpleGrid>
                <Box display={["block", "flex"]}>
                    <Button onClick={() => {}} mb={[4, 0]} colorScheme="blue">
                        Close Position
                    </Button>
                    <Spacer />
                    <Button onClick={() => {}}>Margin Management</Button>
                </Box>
            </Stack>
        </Box>
    )
}

export default PositionUnit
