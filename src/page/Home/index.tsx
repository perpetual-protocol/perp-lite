import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { useEffect, useState } from "react"

import { Connection } from "container/connection"
import GetStarted from "./component/GetStarted"
import Position from "./component/Position"
import TradeComponent from "./component/Trade"

const Home = () => {
    // NOTE: Focus the trade tab once wallet is connected.
    const [tabIndex, setTabIndex] = useState(0)
    const { account } = Connection.useContainer()
    useEffect(() => {
        if (account) {
            setTabIndex(1)
        } else {
            setTabIndex(0)
        }
    }, [account])

    return (
        <>
            {/* Tabs */}
            <Tabs size="md" mt={5} index={tabIndex} onChange={index => setTabIndex(index)} variant="enclosed">
                <TabList>
                    <Tab>Get Started</Tab>
                    <Tab>Trade</Tab>
                    <Tab>Positions</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel py={8} px={3}>
                        <GetStarted />
                    </TabPanel>
                    <TabPanel py={8} px={3}>
                        <TradeComponent />
                    </TabPanel>
                    <TabPanel py={8} px={3}>
                        <Position />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    )
}

export default Home
