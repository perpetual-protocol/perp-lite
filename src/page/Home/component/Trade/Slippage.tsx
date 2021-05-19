import {
    FormControl,
    FormHelperText,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
} from "@chakra-ui/react"
import { useCallback, useMemo } from "react"

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
                    value={slippage}
                    min={0}
                    step={0.1}
                    clampValueOnBlur={false}
                    onChange={handleOnChange}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <FormHelperText>
                    Min: 0.1, max: 1. To use custom slippage please input manually. It also apply to closing position
                    and margin adjustment.
                </FormHelperText>
            </FormControl>
        ),
        [handleOnChange, slippage],
    )
}

export default Slippage
