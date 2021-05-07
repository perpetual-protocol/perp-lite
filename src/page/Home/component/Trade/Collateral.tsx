import { FormControl, InputGroup, InputRightElement, NumberInput, NumberInputField, Text } from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
import { Trade } from "page/Home/container/trade"
import { useCallback, useEffect, useMemo, useState } from "react"
import MyBalance from "./MyBalance"
import { formatInput } from "util/format"
import { USDC_PRECISION } from "constant"
import { Amm } from "container/amm"
import { useDebounce } from "hook/useDebounce"
import Big from "big.js"

function Collateral() {
    const { selectedAmm } = Amm.useContainer()
    const { collateral, setCollateral } = Trade.useContainer()
    const [_collateral, _setCollateral] = useState<string>("")
    const quoteAssetSymbol = selectedAmm?.quoteAssetSymbol || ""
    const debouncedCollateral = useDebounce({ value: _collateral, delay: 500 })

    const handleOnInput = useCallback(
        e => {
            const value = e.target.value
            const formattedValue = formatInput(value, USDC_PRECISION)
            _setCollateral(formattedValue)
        },
        [_setCollateral],
    )

    useEffect(() => {
        /* reset collateral to null */
        if (debouncedCollateral === "") {
            setCollateral(null)
            return
        }
        /* detect if the value is different */
        const b_debouncedCollateral = new Big(debouncedCollateral)
        if (!collateral?.eq(b_debouncedCollateral)) {
            setCollateral(b_debouncedCollateral)
        }
    }, [collateral, debouncedCollateral, setCollateral])

    return useMemo(
        () => (
            <FormControl id="margin">
                <SmallFormLabel>COLLATERAL</SmallFormLabel>
                <NumberInput value={_collateral} onInput={handleOnInput}>
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
        [_collateral, handleOnInput, quoteAssetSymbol],
    )
}

export default Collateral
