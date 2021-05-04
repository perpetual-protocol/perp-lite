import { FormControl, InputGroup, InputRightElement, NumberInput, NumberInputField, Text } from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
import { Trade } from "page/Home/container/trade"
import React, { useCallback, useMemo } from "react"
import MyBalance from "./MyBalance"
import { formatInput } from "util/format"

function Collateral() {
    const { collateral, setCollateral } = Trade.useContainer()

    const handleOnInput = useCallback(
        e => {
            const value = e.target.value
            const formattedValue = formatInput(value, 2)
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
                                USDC
                            </Text>
                        </InputRightElement>
                    </InputGroup>
                </NumberInput>
                <MyBalance />
            </FormControl>
        ),
        [collateral, handleOnInput],
    )
}

export default Collateral
