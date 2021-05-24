import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { useState } from "react"
import GetStarted from "./component/GetStarted"
import Position from "./component/Position"
import TradeComponent from "./component/Trade"

const Home = () => {
    const [tabIndex, setTabIndex] = useState(0)
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
