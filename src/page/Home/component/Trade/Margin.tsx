import {
    FormControl,
    NumberInput,
    InputGroup,
    NumberInputField,
    InputRightElement,
    FormHelperText,
    HStack,
    Box,
    Button,
    Text,
} from "@chakra-ui/react"
import Big from "big.js"
import SmallFormLabel from "component/SmallFormLabel"
import { Trade } from "page/Home/container/trade"
import React, { useCallback, useMemo } from "react"

function Margin() {
    const { margin, setMargin } = Trade.useContainer()

    const handleOnChange = useCallback(
        e => {
            const value = e.target.value
            if (value !== "" && !margin?.eq(value)) {
                setMargin(new Big(value))
            } else if (value === "") {
                setMargin(new Big(0))
            }
        },
        [margin, setMargin],
    )

    return useMemo(
        () => (
            <FormControl id="margin">
                <SmallFormLabel>Margin</SmallFormLabel>
                <NumberInput>
                    <InputGroup>
                        <NumberInputField value={margin?.toString() || ""} onChange={handleOnChange} />
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
                <FormHelperText>
                    <HStack w="100%" justifyContent="space-between" alignItems="flex-start">
                        <Box>My Balance : 12, 481.28</Box>
                        <Button borderRadius="xl" size="xs" variant="outline">
                            MAX
                        </Button>
                    </HStack>
                </FormHelperText>
            </FormControl>
        ),
        [handleOnChange, margin],
    )
}

export default Margin
