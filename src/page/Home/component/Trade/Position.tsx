import { FormControl, InputGroup, Input, InputRightElement, Text } from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
import { Amm } from "container/amm"
import { usePositionSize } from "./hook/usePositionSize"

function Position() {
    const { selectedAmm } = Amm.useContainer()
    const { positionSize, isCalculating } = usePositionSize()
    const baseAssetSymbol = selectedAmm?.baseAssetSymbol || ""

    return (
        <FormControl id="position">
            <SmallFormLabel>Position</SmallFormLabel>
            <InputGroup>
                <Input variant="filled" isReadOnly value={isCalculating ? "calculating..." : positionSize} />
                <InputRightElement w="54px">
                    <Text
                        w="100%"
                        textAlign="center"
                        fontWeight="bold"
                        fontSize="xs"
                        color="gray.500"
                        textTransform="uppercase"
                    >
                        {baseAssetSymbol}
                    </Text>
                </InputRightElement>
            </InputGroup>
        </FormControl>
    )
}

export default Position
