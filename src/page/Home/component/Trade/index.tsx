import {
    SimpleGrid,
    VStack,
    ButtonGroup,
    Button,
    FormControl,
    Select,
    NumberInput,
    InputGroup,
    NumberInputField,
    InputRightElement,
    FormHelperText,
    HStack,
    Box,
    Input,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Heading,
    Table,
    Tbody,
    Tr,
    Td,
    Text,
} from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
import React from "react"

function Trade() {
    const [side, setSide] = React.useState("long")
    const [leverage, setLeverage] = React.useState(3)

    return (
        <SimpleGrid columns={[1, null, 2]} spacing={16}>
            <VStack spacing={6} p={0}>
                <ButtonGroup w="100%" isAttached variant="solid">
                    <Button
                        size="sm"
                        isFullWidth
                        onClick={() => setSide("long")}
                        colorScheme={side === "long" ? "green" : "gray"}
                        mr="-px"
                        variant="solid"
                    >
                        Long
                    </Button>
                    <Button
                        size="sm"
                        isFullWidth
                        onClick={() => setSide("short")} // width="100px"
                        colorScheme={side === "short" ? "red" : "gray"}
                    >
                        Short
                    </Button>
                </ButtonGroup>

                <FormControl id="market">
                    <SmallFormLabel>Market</SmallFormLabel>
                    <Select>
                        <option value="option1">BTC / USDC</option>
                        <option value="option1">ETH / USDC</option>
                        <option value="option1">PERP / USDC</option>
                    </Select>
                </FormControl>

                <FormControl id="margin">
                    <SmallFormLabel>Margin</SmallFormLabel>
                    <NumberInput>
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

                    <FormHelperText>
                        <HStack w="100%" justifyContent="space-between" alignItems="flex-start">
                            <Box>My Balance : 12, 481.28</Box>
                            <Button borderRadius="xl" size="xs" variant="outline">
                                MAX
                            </Button>
                        </HStack>
                    </FormHelperText>
                </FormControl>
                <FormControl id="collateral">
                    <SmallFormLabel>Collateral</SmallFormLabel>

                    <InputGroup>
                        <Input variant="filled" isReadOnly value="0.431" />
                        <InputRightElement w="54px">
                            <Text
                                w="100%"
                                textAlign="center"
                                fontWeight="bold"
                                fontSize="xs"
                                color="gray.500"
                                textTransform="uppercase"
                            >
                                BTC
                            </Text>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <FormControl id="leverages">
                    <SmallFormLabel>Leverages</SmallFormLabel>
                    <Box px={10} pt={4} pb={2} bg="blackAlpha.50" borderRadius="xl">
                        <Slider
                            onChange={value => setLeverage(value)}
                            defaultValue={3}
                            min={1}
                            max={10}
                            step={0.5}
                            colorScheme={side === "long" ? "green" : "red"}
                        >
                            <SliderTrack bg="gray.300">
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb
                                _active={{
                                    userSelect: "none",
                                    pb: ["50px", 0],
                                    pt: ["6px", 0],
                                    height: ["88px", "32px"],
                                    transform: ["translateY(-70px)", "translateY(-50%)"],
                                }}
                                h={8}
                                w={12}
                                bg={side === "long" ? "green.50" : "red.50"}
                            >
                                <Text fontSize="sm" fontWeight="bold" color={side === "long" ? "green.600" : "red.600"}>
                                    {leverage}×
                                </Text>
                            </SliderThumb>
                        </Slider>
                    </Box>
                    <FormHelperText>Up to 10×</FormHelperText>
                </FormControl>
                <FormControl id="slippage">
                    <SmallFormLabel>Slippage (%)</SmallFormLabel>
                    <NumberInput
                        allowMouseWheel
                        defaultValue={0.1}
                        min={0.1}
                        max={1}
                        step={0.1}
                        clampValueOnBlur={false}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <FormHelperText>
                        Min: 0.1, max: 1. To use custom slippage please input manually. It also apply to closing
                        position and margin adjustment.
                    </FormHelperText>
                </FormControl>
            </VStack>

            <VStack p={0} spacing={6}>
                <Heading w="full" size="md">
                    Transaction Summary
                </Heading>

                <VStack spacing={2} width="full">
                    <Button size="md" isFullWidth colorScheme="blue">
                        Send Transaction
                    </Button>
                    <Text fontSize="sm" color="gray.500">
                        Confirm in Metamask
                    </Text>
                </VStack>
                <Box width="100%" borderStyle="solid" borderWidth="1px" borderColor="gray.200" borderRadius="12px">
                    <Table size="sm" borderRadius="12px" overflow="hidden" w="100%" variant="simple">
                        <Tbody>
                            <Tr>
                                <Td>Entry Price</Td>
                                <Td isNumeric>25.4</Td>
                            </Tr>
                            <Tr>
                                <Td>Price Impact</Td>
                                <Td isNumeric>-0.2%</Td>
                            </Tr>
                            <Tr>
                                <Td>Liquidation Price</Td>
                                <Td isNumeric>47.28</Td>
                            </Tr>
                            <Tr>
                                <Td>Transaction Fee</Td>
                                <Td isNumeric>0.91444</Td>
                            </Tr>
                            <Tr fontWeight="bold">
                                <Td>Total Cost</Td>
                                <Td isNumeric>0.91444</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </Box>
            </VStack>
        </SimpleGrid>
    )
}

export default Trade
