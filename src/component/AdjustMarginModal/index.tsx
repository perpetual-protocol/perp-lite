import {
    Divider,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
} from "@chakra-ui/react"
import AdjustButton from "./AdjustButton"
import MarginDirSwitcher from "./MarginDirSwitcher"
import MarginInput from "./MarginInput"
import UpdatedInfo from "./UpdatedInfo"
import { Margin } from "./container/margin"
import { useMemo } from "react"
import { Position } from "container/position"

function AdjustMarginModal() {
    const {
        state: { isAdjustMarginModalOpen },
        closeAdjustMarginModal,
    } = Position.useContainer()

    return useMemo(
        () => (
            <Margin.Provider>
                <Modal
                    isCentered
                    motionPreset="slideInBottom"
                    isOpen={isAdjustMarginModalOpen}
                    onClose={closeAdjustMarginModal}
                >
                    <ModalOverlay />
                    <ModalContent borderRadius="2xl" pb={3}>
                        <ModalHeader>Adjust Margin</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={5}>
                                <MarginDirSwitcher />
                                <MarginInput />
                                <Divider />
                                <UpdatedInfo />
                                <Divider />
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <AdjustButton />
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Margin.Provider>
        ),
        [closeAdjustMarginModal, isAdjustMarginModalOpen],
    )
}

export default AdjustMarginModal
