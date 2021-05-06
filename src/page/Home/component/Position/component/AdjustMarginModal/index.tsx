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
import { PositionInfo } from "constant"
import AdjustButton from "./AdjustButton"
import MarginDirSwitcher from "./MarginDirSwitcher"
import MarginInput from "./MarginInput"
import UpdatedInfo from "./UpdatedInfo"
import { Margin } from "./container/margin"
import { useMemo } from "react"

interface AdjustMarginModalProps {
    data: PositionInfo
    isOpen: boolean
    onClose: () => void
}

function AdjustMarginModal({ data, isOpen, onClose }: AdjustMarginModalProps) {
    const { quoteAssetSymbol, address } = data
    return useMemo(
        () => (
            <Margin.Provider>
                <Modal isCentered motionPreset="slideInBottom" isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent borderRadius="2xl" pb={3}>
                        <ModalHeader>Adjust Margin</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={5}>
                                <MarginDirSwitcher />
                                <MarginInput symbol={quoteAssetSymbol} />
                                <Divider />
                                <UpdatedInfo />
                                <Divider />
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <AdjustButton address={address} />
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Margin.Provider>
        ),
        [address, isOpen, onClose, quoteAssetSymbol],
    )
}

export default AdjustMarginModal
