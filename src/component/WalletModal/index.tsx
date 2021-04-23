import React from "react"
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack } from "@chakra-ui/react"
import WalletButton from "./WalletButton"
import DisconnectButton from "./DisconnectButton"
import { WalletInfo, SUPPORTED_WALLETS } from "../../constant/wallet"
import { User } from "container/user"
import { Global } from "container/global"

function WalletListModal() {
    const {
        state: { address },
    } = User.useContainer()

    const {
        state: {
            modal: { isWalletOpen },
        },
        actions: { toggleWalletModal },
    } = Global.useContainer()

    return (
        <Modal isCentered={true} size="xs" isOpen={isWalletOpen} onClose={toggleWalletModal}>
            <ModalOverlay />
            <ModalContent bg="gray.800" color="gray.200">
                <ModalHeader fontWeight="400" fontSize="sm">
                    Connect Wallet
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb="1.5rem">
                    <Stack spacing={2}>
                        {SUPPORTED_WALLETS.map((value: WalletInfo) => {
                            return (
                                <WalletButton
                                    key={value.id}
                                    id={value.id}
                                    name={value.name}
                                    connector={value.connector}
                                    src={require(`../../asset/wallet/${value.iconName}`).default}
                                />
                            )
                        })}
                        {address && <DisconnectButton />}
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default WalletListModal
