import { FormControl, InputGroup, InputRightElement, NumberInput, NumberInputField, Text } from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
import { Trade } from "page/Home/container/trade"
import React, { useCallback, useMemo } from "react"
import MyBalance from "./MyBalance"
import { formatInput } from "util/format"
import { USDC_PRECISION } from "constant"
import { Amm } from "container/amm"

function Collateral() {
    const { selectedAmm } = Amm.useContainer()
    const { collateral, setCollateral } = Trade.useContainer()
    const quoteAssetSymbol = selectedAmm?.quoteAssetSymbol || ""

    const handleOnInput = useCallback(
        e => {
            const value = e.target.value
            const formattedValue = formatInput(value, USDC_PRECISION)
            setCollateral(formattedValue)
        },
        [setCollateral],
    )

    return useMemo(
        () => (
            <FormControl id="margin">
                <SmallFormLabel>COLLATERAL</SmallFormLabel>
                <NumberInput value={collateral} onInput={handleOnInput}>
                    <InputGroup>
                        <NumberInputField />
                        <InputRightElement w="54px">
                            <Text
                                w="100%"
                                textAlign="center"
                                fontWeight="bold"
                                fontSize="xs"
                                color="blue.500"
                                textTransform="uppercase"
                            >
                                {quoteAssetSymbol}
                            </Text>
                        </InputRightElement>
                    </InputGroup>
                </NumberInput>
                <MyBalance />
            </FormControl>
        ),
        [collateral, handleOnInput, quoteAssetSymbol],
    )
}

export default Collateral
