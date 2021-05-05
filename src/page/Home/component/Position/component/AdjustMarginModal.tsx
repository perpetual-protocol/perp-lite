import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    VStack,
    ButtonGroup,
    Button,
    FormControl,
    NumberInput,
    InputGroup,
    NumberInputField,
    InputRightElement,
    FormHelperText,
    HStack,
    Box,
    Divider,
    Heading,
    Table,
    Tbody,
    Tr,
    Td,
    ModalFooter,
    Text,
} from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
import { PositionInfo } from "constant"
import React, { useState } from "react"

enum MarginDir {
    Add,
    Reduce,
}

interface AdjustMarginModalProps {
    data: PositionInfo
    isOpen: boolean
    onClose: () => void
}

function AdjustMarginModal({ data, isOpen, onClose }: AdjustMarginModalProps) {
    const [marginDir, setMarginDir] = useState<MarginDir>(MarginDir.Add)
    return (
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
                                onClick={() => setMarginDir(MarginDir.Add)} // width="100px"
                                colorScheme={marginDir === MarginDir.Add ? "green" : "gray"}
                                mr="-px"
                                variant="solid"
                            >
                                Add
                            </Button>
                            <Button
                                size="sm"
                                isFullWidth
                                onClick={() => setMarginDir(MarginDir.Reduce)} // width="100px"
                                colorScheme={marginDir === MarginDir.Reduce ? "red" : "gray"}
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
    )
}

export default AdjustMarginModal
