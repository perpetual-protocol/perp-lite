import {
    useDisclosure,
    Box,
    Stack,
    HStack,
    Heading,
    Badge,
    SimpleGrid,
    Button,
    Spacer,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    VStack,
    Table,
    Tbody,
    Tr,
    Td,
    Divider,
    ModalFooter,
    ButtonGroup,
    FormControl,
    NumberInput,
    InputGroup,
    NumberInputField,
    InputRightElement,
    FormHelperText,
    Text,
} from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
import React from "react"
import DataUnit from "./DataUnit"

function PositionUnit() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [openPositionModal, setOpenPositionModal] = React.useState(false)
    const [side, setSide] = React.useState("add")
    return (
        <Box>
            <Stack direction="column" spacing={4} borderRadius="2xl" borderWidth="1px" borderColor="gray.200" p={6}>
                <HStack>
                    <Heading size="md">BTC</Heading>
                    <Badge colorScheme="green">Long</Badge>
                </HStack>
                <SimpleGrid minChildWidth={["40%", "30%", "20%"]} spacing={4}>
                    <DataUnit label="PnL" value="+129" />
                    <DataUnit label="Position Size" value="24.297" />
                    <DataUnit label="Leverage" value="1.4×" />
                    <DataUnit label="Entry Price" value="1,398" />
                    <DataUnit label="Est.Liq.Price" value="943" />
                    <DataUnit label="Margin" value="53,292" />
                    <DataUnit label="Margin Ratio" value="40%" />
                </SimpleGrid>
                <Box display={["block", "flex"]}>
                    <Button onClick={() => setOpenPositionModal(true)} mb={[4, 0]} colorScheme="blue">
                        Close Position
                    </Button>
                    <Spacer />
                    <Button onClick={onOpen}>Margin Management</Button>
                </Box>
            </Stack>

            <Modal
                isCentered
                motionPreset="slideInBottom"
                isOpen={openPositionModal}
                onClose={() => setOpenPositionModal(false)}
            >
                <ModalOverlay />
                <ModalContent borderRadius="2xl" pb={3}>
                    <ModalHeader>Close Position</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={5}>
                            <Heading w="full" size="sm">
                                Transaction Summary
                            </Heading>
                            <Box
                                width="100%"
                                borderStyle="solid"
                                borderWidth="1px"
                                borderColor="gray.200"
                                borderRadius="12px"
                            >
                                <Table size="sm" borderRadius="12px" overflow="hidden" w="100%" variant="simple">
                                    <Tbody>
                                        <Tr fontWeight="bold">
                                            <Td>Exit Price</Td>
                                            <Td isNumeric>5.35473 USDC</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Margin</Td>
                                            <Td isNumeric>1,157.88 USDC</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>PnL</Td>
                                            <Td isNumeric>-67.62 USDC</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Transaction Fee</Td>
                                            <Td isNumeric>-4.57 USDC</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Total Value Received</Td>
                                            <Td isNumeric>1,083.48 USDC</Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </Box>
                            <Divider />
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button isFullWidth colorScheme="blue" size="md" onClick={() => setOpenPositionModal(false)}>
                            Close Position
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isCentered motionPreset="slideInBottom" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent borderRadius="2xl" pb={3}>
                    <ModalHeader>Adjust Margin</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={5}>
                            <ButtonGroup w="100%" isAttached variant="solid">
                                <Button
                                    size="sm"
                                    isFullWidth
                                    onClick={() => setSide("add")} // width="100px"
                                    colorScheme={side === "add" ? "green" : "gray"}
                                    mr="-px"
                                    variant="solid"
                                >
                                    Add
                                </Button>
                                <Button
                                    size="sm"
                                    isFullWidth
                                    onClick={() => setSide("remove")} // width="100px"
                                    colorScheme={side === "remove" ? "red" : "gray"}
                                >
                                    Reduce
                                </Button>
                            </ButtonGroup>
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
                            <Divider />

                            <Heading w="full" size="sm">
                                Updated Position
                            </Heading>
                            <Box
                                width="100%"
                                borderStyle="solid"
                                borderWidth="1px"
                                borderColor="gray.200"
                                borderRadius="12px"
                            >
                                <Table size="sm" borderRadius="12px" overflow="hidden" w="100%" variant="simple">
                                    <Tbody>
                                        <Tr>
                                            <Td>Margin</Td>
                                            <Td isNumeric>25.4</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Margin Ratio</Td>
                                            <Td isNumeric>-0.2%</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Leverage</Td>
                                            <Td isNumeric>4.4×</Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </Box>
                            <Divider />
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button isFullWidth colorScheme="blue" size="md">
                            Adjust
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default PositionUnit
