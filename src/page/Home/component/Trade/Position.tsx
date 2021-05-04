import { FormControl, InputGroup, Input, InputRightElement, Text } from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
import { Amm } from "container/amm"
import React from "react"

function Position() {
    const { selectedAmm } = Amm.useContainer()
    return (
        <FormControl id="position">
            <SmallFormLabel>Position</SmallFormLabel>
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
                        {selectedAmm}
                    </Text>
                </InputRightElement>
            </InputGroup>
        </FormControl>
    )
}

export default Position
