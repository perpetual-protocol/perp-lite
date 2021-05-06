import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
    Button,
    FormControl,
    NumberInput,
    InputGroup,
    NumberInputField,
    InputRightElement,
    FormHelperText,
    HStack,
    Text,
    Box,
} from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
import { Contract } from "container/contract"
import { useToken } from "hook/useToken"
import { CHAIN_ID } from "connector"
import { USDC_DECIMAL_DIGITS, USDC_PRECISION } from "constant"
import { formatInput, numberWithCommasUsdc } from "util/format"
import { useDebounce } from "hook/useDebounce"
import { Margin } from "./container/margin"
import Big from "big.js"

interface MarginInputProps {
    symbol: string
}

function MarginInput({ symbol }: MarginInputProps) {
    const { addressMap } = Contract.useContainer()
    const { margin, setMargin } = Margin.useContainer()
    const { balance } = useToken(addressMap ? addressMap.XDaiUsdc : "", USDC_DECIMAL_DIGITS, CHAIN_ID.XDai)
    const [_margin, _setMargin] = useState<string>("")
    const debouncedMargin = useDebounce({ value: _margin, delay: 500 })

    const handleOnInput = useCallback(e => {
        const value = e.target.value
        const formattedValue = formatInput(value, USDC_PRECISION)
        _setMargin(formattedValue)
    }, [])

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
                                {symbol}
                            </Text>
                        </InputRightElement>
                    </InputGroup>
                </NumberInput>
                <FormHelperText>
                    <HStack w="100%" justifyContent="space-between" alignItems="flex-start">
                        <Box>My Balance : {numberWithCommasUsdc(balance)}</Box>
                        <Button borderRadius="xl" size="xs" variant="outline">
                            MAX
                        </Button>
                    </HStack>
                </FormHelperText>
            </FormControl>
        ),
        [_margin, balance, handleOnInput, symbol],
    )
}

export default MarginInput
