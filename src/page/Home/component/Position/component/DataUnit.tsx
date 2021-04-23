import { Stack, Text } from "@chakra-ui/react"
import React from "react"

interface Props {
    label: string
    value: string
}

function DataUnit(props: Props) {
    return (
        <Stack spacing={0} dir="column">
            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                {props.label}
            </Text>
            <Text fontSize="md" fontWeight="bold">
                {props.value}
            </Text>
        </Stack>
    )
}

export default DataUnit
