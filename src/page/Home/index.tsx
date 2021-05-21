import {
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
} from "@chakra-ui/react"
import { useState } from "react"
import GetStarted from "./component/GetStarted"
import Position from "./component/Position"
import TradeComponent from "./component/Trade"

const Home = () => {
    const [tabIndex, setTabIndex] = useState(0)
    // geo blocking modal
    const [isGeoBlocked, setIsGeoBlocked] = useState(true)

    // agreements modal
    const [showAgreement, setShowAgreement] = useState(true)

    // todo:
    // 不支援的地區：顯示 geo blocking modal
    // 支援的地區：顯示 agreements

    return (
        <>
            {/* Modals */}

            <Modal
                scrollBehavior="inside"
                closeOnEsc={false}
                closeOnOverlayClick={false}
                isCentered
                isOpen={showAgreement && !isGeoBlocked}
                onClose={() => {}}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>User Agreements</ModalHeader>
                    {/* <ModalCloseButton /> */}
                    <ModalBody>
                        <Text>
                            Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id
                            consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco
                            minim nostrud elit officia tempor esse quis. Sunt ad dolore quis aute consequat. Magna
                            exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing.
                            Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                            aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi consectetur esse laborum
                            eiusmod pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                        </Text>
                        <Text>
                            Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id
                            consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco
                            minim nostrud elit officia tempor esse quis. Sunt ad dolore quis aute consequat. Magna
                            exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing.
                            Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                            aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi consectetur esse laborum
                            eiusmod pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                        </Text>
                        <Text>
                            Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id
                            consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco
                            minim nostrud elit officia tempor esse quis. Sunt ad dolore quis aute consequat. Magna
                            exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing.
                            Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                            aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi consectetur esse laborum
                            eiusmod pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={() => setShowAgreement(false)}>
                            I Agree
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal
                scrollBehavior="inside"
                closeOnEsc={false}
                closeOnOverlayClick={false}
                isCentered
                isOpen={isGeoBlocked}
                onClose={() => {}}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Your region is not supoorted</ModalHeader>
                    {/* <ModalCloseButton /> */}
                    <ModalBody>
                        <Text>
                            Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id
                            consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco
                            minim nostrud elit officia tempor esse quis. Sunt ad dolore quis aute consequat. Magna
                            exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing.
                            Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                            aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi consectetur esse laborum
                            eiusmod pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={() => {
                                setIsGeoBlocked(false)
                                setShowAgreement(true)
                            }}
                        >
                            Demo: if not geoblocked
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

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
