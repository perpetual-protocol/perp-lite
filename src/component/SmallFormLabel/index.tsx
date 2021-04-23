import { FormLabel, Text } from "@chakra-ui/react"
import React from "react"

interface Props {
    children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined
}

function SmallFormLabel(props: Props) {
    return (
        <FormLabel>
            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                {props.children}
            </Text>
        </FormLabel>
    )
}

export default SmallFormLabel
