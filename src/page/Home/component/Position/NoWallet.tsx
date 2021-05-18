import { Box, Text } from "@chakra-ui/react"

function NoWallet() {
    return (
        <Box>
            <Text size="md" color="gray.400">
                No connected wallet.
            </Text>
        </Box>
    )
}

export default NoWallet
