import { useState, useEffect } from "react"
import {
    Tabs,
    TabList,
    Tab,
    Text,
    Spacer,
    TabPanels,
    Heading,
    Stack,
    TabPanel,
    Link,
    Button,
    Divider,
    HStack,
} from "@chakra-ui/react"
import TradeComponent from "./component/Trade"
import Position from "./component/Position"
import { ExternalLinkIcon } from "@chakra-ui/icons"

const Home = () => {
    const [tabIndex, setTabIndex] = useState(2)
    // the default is "get started tab"

    useEffect(() => {
        // TODO: switch to the first tab once the user logged in
        // setTabIndex(0)
    }, [])

    return (
        <Tabs size="md" mt={5} index={tabIndex} onChange={index => setTabIndex(index)} variant="soft-rounded">
            <TabList>
                <Tab>Trade</Tab>
                <Tab>Positions</Tab>
                <Spacer />
                <Tab>Get Started</Tab>
            </TabList>
            <TabPanels>
                <TabPanel py={8} px={3}>
                    <TradeComponent />
                </TabPanel>
                <TabPanel py={8} px={3}>
                    <Position />
                </TabPanel>
                <TabPanel py={8} px={3}>
                    <Stack spacing={10}>
                        <Stack spacing={5}>
                            <Heading size="md">About</Heading>
                            <Text>
                                This is a lite version of{" "}
                                <Link color="blue.500" href="https://perp.exchange" isExternal>
                                    Perpetual Protocol <ExternalLinkIcon mx="2px" />
                                </Link>{" "}
                                UI with essential features. Note that you need to manually switch to{" "}
                                <strong>xDai network</strong> to trade.
                            </Text>
                            <HStack>
                                <Link
                                    color="blue.500"
                                    href="https://github.com/perpetual-protocol/perp-lite"
                                    isExternal
                                >
                                    Github <ExternalLinkIcon mx="2px" />
                                </Link>{" "}
                                <Link color="blue.500" href="https://discord.com/invite/mYKKRTn" isExternal>
                                    Discord <ExternalLinkIcon mx="2px" />
                                </Link>
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
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default Home
