import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react"
import { ExternalLink } from "component/ExternalLink"
import { useIsBlockedRegion } from "./useIsBlockedRegion"

function BlockedRegionModal() {
    const isBlockedRegion = useIsBlockedRegion()
    return (
        <Modal
            scrollBehavior="inside"
            closeOnEsc={false}
            closeOnOverlayClick={false}
            isCentered
            isOpen={isBlockedRegion}
            onClose={() => {}}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Service Not Available in Your Region</ModalHeader>
                <ModalBody>
                    <Text>
                        Sorry! For compliance reasons, this service is not accessible in your area. Use of VPN, Tor,
                        proxies or other means to circumvent this restriction is a violation of our Terms of Service.
                    </Text>
                </ModalBody>
                <ModalFooter justifyContent="flex-start">
                    For details, please see our&nbsp;
                    <ExternalLink color="blue.500" href="https://docs.perp.fi/library/terms-of-service" isExternal>
                        Terms of Service.
                    </ExternalLink>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default BlockedRegionModal
