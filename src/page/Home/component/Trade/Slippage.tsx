import {
    FormControl,
    FormHelperText,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    InputRightElement,
    Text,
} from "@chakra-ui/react"
import React, { useCallback, useMemo } from "react"

import SmallFormLabel from "component/SmallFormLabel"
import { Trade } from "container/trade"

function Slippage() {
    const { slippage, setSlippage } = Trade.useContainer()

    const handleOnChange = useCallback(
        value => {
            if (value >= 0) {
                setSlippage(value)
            }
        },
        [setSlippage],
    )
    return useMemo(
        () => (
            <FormControl id="slippage">
                <SmallFormLabel>Slippage (%)</SmallFormLabel>
                <NumberInput
                    allowMouseWheel
                    min={0}
                    step={0.1}
                    max={100}
                    clampValueOnBlur={false}
                    onChange={handleOnChange}
                    value={slippage}
                    focusInputOnChange={true}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                    <InputRightElement w="54px" mr={4}>
                        <Text
                            w="100%"
                            textAlign="center"
                            fontWeight="bold"
                            fontSize="xs"
                            color="gray.500"
                            textTransform="uppercase"
                        >
                            %
                        </Text>
                    </InputRightElement>
                </NumberInput>
                <FormHelperText>
                    To use custom slippage, please input manually. It also applies to closing position and margin
                    adjustment.
                </FormHelperText>
            </FormControl>
        ),
        [handleOnChange, slippage],
    )
}

export default Slippage
