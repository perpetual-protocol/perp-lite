import { Button, Divider, HStack, Heading, Stack, Text } from "@chakra-ui/react"

import { ExternalLink } from "component/ExternalLink"
import { ExternalLinkIcon } from "@chakra-ui/icons"

function GetStarted() {
    return (
        <Stack spacing={10}>
            <Stack spacing={5}>
                <Heading size="md">About</Heading>
                <Text>
                    This is a lite version of{" "}
                    <ExternalLink color="blue.500" href="https://perp.exchange" isExternal>
                        Perpetual Protocol <ExternalLinkIcon mx="2px" />
                    </ExternalLink>{" "}
                    UI with essential features. Note that you need to manually switch to <strong>xDai network</strong>{" "}
                    to trade.
                </Text>
                <HStack>
                    <ExternalLink color="blue.500" href="https://github.com/perpetual-protocol/perp-lite" isExternal>
                        Github <ExternalLinkIcon mx="2px" />
                    </ExternalLink>{" "}
                    <ExternalLink color="blue.500" href="https://discord.com/invite/mYKKRTn" isExternal>
                        Discord <ExternalLinkIcon mx="2px" />
                    </ExternalLink>
                </HStack>
            </Stack>
            <Divider />
            <Stack spacing={5}>
                <Heading size="md">Switch Network</Heading>
                <Text>
                    You're currently on <strong>Ethereum Mainnet</strong>{" "}
                </Text>
                <Button isFullWidth isDisabled colorScheme="blue">
                    Add / Switch to xDai Network
                </Button>
                <Text fontSize="sm" color="gray.500">
                    This feature is not available for now.
                </Text>
            </Stack>
        </Stack>
    )
}

export default GetStarted
