import { FormControl, InputGroup, InputRightElement, NumberInput, NumberInputField, Text } from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
import { Trade } from "page/Home/container/trade"
import React, { useCallback, useMemo } from "react"
import MyBalance from "./MyBalance"
import { formatInput } from "util/format"

function Margin() {
    const { margin, setMargin } = Trade.useContainer()

    const handleOnChange = useCallback(
        value => {
            setMargin(formatInput(value, 2))
        },
        [setMargin],
    )

    return useMemo(
        () => (
            <FormControl id="margin">
                <SmallFormLabel>Margin</SmallFormLabel>
                <NumberInput value={margin} onChange={handleOnChange}>
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
        [handleOnChange, margin],
    )
}

export default Margin
