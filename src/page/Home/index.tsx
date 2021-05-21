import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import GetStarted from "./component/GetStarted"
import Position from "./component/Position"
import TradeComponent from "./component/Trade"
import { User } from "container/user"

const Home = () => {
    const [tabIndex, setTabIndex] = useState(0)

    // Need review: 偵測到 connect wallet 以後，設定  setTabIndex(1)，才不必每次都看到 get started

    const {
        state: { address },
    } = User.useContainer()

    useEffect(() => {
        if (address) {
            setTabIndex(1)
        } else {
            setTabIndex(0)
        }
    }, [address])

    return (
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
    )
}

export default Home
