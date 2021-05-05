import React from "react"
import { Tabs, TabList, Tab, Text, Spacer, TabPanels, Heading, Stack, TabPanel } from "@chakra-ui/react"
import TradeComponent from "./component/Trade"
import Position from "./component/Position"
import { Trade } from "./container/trade"

const Home = () => {
    return (
        <Trade.Provider>
            <Tabs size="md" mt={5} defaultIndex={0} variant="soft-rounded">
                <TabList>
                    <Tab>Trade</Tab>
                    <Tab>Positions</Tab>
                    <Spacer />
                    <Tab>About</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel py={8} px={3}>
                        <TradeComponent />
                    </TabPanel>
                    <TabPanel py={8} px={3}>
                        <Position />
                    </TabPanel>
                    <TabPanel py={8} px={3}>
                        <Stack spacing={3}>
                            <Heading size="md">About</Heading>
                            <Text>
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam autem iusto atque
                                quisquam numquam, aliquam rem minus illum natus reiciendis. Asperiores ipsam repellendus
                                delectus laudantium, fugit quam illo vero cupiditate!
                            </Text>
                        </Stack>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Trade.Provider>
    )
}

export default Home
