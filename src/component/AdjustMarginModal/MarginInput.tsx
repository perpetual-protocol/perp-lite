import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    HStack,
    InputGroup,
    InputRightElement,
    NumberInput,
    NumberInputField,
    Text,
} from "@chakra-ui/react"
import { MarginDir, USDC_DECIMAL_DIGITS, USDC_PRECISION } from "constant"
import { formatInput, numberWithCommasUsdc } from "util/format"
import { useCallback, useEffect, useMemo, useState } from "react"

import Big from "big.js"
import { CHAIN_ID } from "connector"
import { Contract } from "container/contract"
import { Margin } from "./container/margin"
import { Position } from "container/position"
import SmallFormLabel from "component/SmallFormLabel"
import { useDebounce } from "hook/useDebounce"
import { useToken } from "hook/useToken"

function MarginInput() {
    const {
        state: { quoteAssetSymbol },
    } = Position.useContainer()
    const { addressMap } = Contract.useContainer()
    const { margin, setMargin, marginDir } = Margin.useContainer()
    const { balance } = useToken(addressMap ? addressMap.XDaiUsdc : "", USDC_DECIMAL_DIGITS, CHAIN_ID.XDai)
    const [_margin, _setMargin] = useState<string>("")
    const debouncedMargin = useDebounce({ value: _margin, delay: 500 })

    const handleOnInput = useCallback(e => {
        const value = e.target.value
        if (value >= 0) {
            const formattedValue = formatInput(value, USDC_PRECISION)
            _setMargin(formattedValue)
        }
    }, [])

    const handleOnClick = useCallback(() => {
        /* make sure the precision will be controlled */
        const fixedBalance = balance.toFixed(2)
        _setMargin(fixedBalance)
    }, [balance])

    useEffect(() => {
        /* reset margin to null */
        if (debouncedMargin === "") {
            setMargin(null)
            return
        }
        /* detect if the value is different */
        const b_debouncedMargin = new Big(debouncedMargin)
        if (!margin?.eq(b_debouncedMargin)) {
            setMargin(b_debouncedMargin)
        }
    }, [debouncedMargin, margin, setMargin])

    return useMemo(
        () => (
            <FormControl id="margin">
                <SmallFormLabel>Margin</SmallFormLabel>
                <NumberInput value={_margin} onInput={handleOnInput}>
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
                {marginDir === MarginDir.Add && (
                    <FormHelperText>
                        <HStack w="100%" justifyContent="space-between" alignItems="flex-start">
                            <Box>My Balance : {numberWithCommasUsdc(balance)}</Box>

                            <Button borderRadius="xl" size="xs" variant="outline" onClick={handleOnClick}>
                                MAX
                            </Button>
                        </HStack>
                    </FormHelperText>
                )}
            </FormControl>
        ),
        [_margin, balance, handleOnClick, handleOnInput, marginDir, quoteAssetSymbol],
    )
}

export default MarginInput
