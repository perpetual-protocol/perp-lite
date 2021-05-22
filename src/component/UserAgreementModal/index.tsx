import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Checkbox,
    ModalFooter,
    Button,
    Text,
} from "@chakra-ui/react"
import { ExternalLink } from "component/ExternalLink"
import { useLocalStorage } from "hook/useLocalStorage"
import { useCallback, useState } from "react"
import { STORAGE_KEY } from "constant"

const { IS_TOS_AGREED } = STORAGE_KEY

function UserAgreementModal() {
    const [isRead, setIsRead] = useState(false)
    const [isTosAgreed, setIsTosAgreed] = useLocalStorage(IS_TOS_AGREED.name, IS_TOS_AGREED.defaultValue)

    const handleOnCheck = useCallback(() => {
        setIsRead(!isRead)
    }, [isRead])

    const handleOnClick = useCallback(() => {
        setIsTosAgreed("true")
    }, [setIsTosAgreed])

    return (
        <Modal
            scrollBehavior="inside"
            closeOnEsc={false}
            closeOnOverlayClick={false}
            isCentered
            isOpen={isTosAgreed === "false"}
            onClose={() => {}}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Welcome to PERP Lite</ModalHeader>
                <ModalBody>
                    <Text>
                        Perpetual Protocol is a decentralized perpetual contract protocol with virtual AMMs to provide
                        guaranteed liquidity. Please visit our
                        <ExternalLink
                            color="blue.500"
                            href="https://medium.com/@perpetualprotocol/a-deep-dive-into-our-virtual-amm-vamm-40345c522eeb"
                            isExternal
                        >
                            &nbsp;Docs&nbsp;
                        </ExternalLink>
                        to know more
                    </Text>
                    <br />
                    <Text>
                        This is <strong>BETA</strong> Software — use at your own risk.
                    </Text>
                    <Checkbox size="md" colorScheme="green" onChange={handleOnCheck}>
                        I have read and agreed to
                        <ExternalLink color="blue.500" href="https://docs.perp.fi/library/terms-of-service" isExternal>
                            &nbsp;Terms of Service&nbsp;
                        </ExternalLink>
                    </Checkbox>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleOnClick} isDisabled={!isRead}>
                        START
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default UserAgreementModal
