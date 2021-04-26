import { SimpleGrid, VStack } from "@chakra-ui/react"
import React from "react"
import Collateral from "./Collateral"
import Leverage from "./Leverage"
import Margin from "./Margin"
import MarketSelector from "./MarketSelector"
import SideSwitcher from "./SideSwitcher"
import Slippage from "./Slippage"
import Summary from "./Summary"

function Trade() {
    return (
        <SimpleGrid columns={[1, null, 2]} spacing={16}>
            <VStack spacing={6} p={0}>
                <SideSwitcher />
                <MarketSelector />
                <Margin />
                <Collateral />
                <Leverage />
                <Slippage />
            </VStack>
            <VStack p={0} spacing={6}>
                <Summary />
            </VStack>
        </SimpleGrid>
    )
}

export default Trade
