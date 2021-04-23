import React, { useCallback } from "react"
import { Button, Flex, Image, Spacer } from "@chakra-ui/react"
import { AbstractConnector } from "@web3-react/abstract-connector"
import CheckSvg from "../../asset/check.svg"
import { User } from "container/user"
import { Global } from "container/global"
import { useWeb3React } from "@web3-react/core"

function WalletButton({
    src,
    name,
    connector,
    id,
}: {
    src: string
    name: string
    connector: AbstractConnector
    id: string
}) {
    const {
        actions: { login },
    } = User.useContainer()
    const { connector: activeConnector } = useWeb3React()

    const {
        actions: { toggleWalletModal },
    } = Global.useContainer()

    const isActiveConnector = activeConnector === connector

    const handleOnClick = useCallback(() => {
        if (!isActiveConnector) {
            login(connector, id)
        }
        toggleWalletModal()
    }, [connector, login, toggleWalletModal, id, isActiveConnector])

    return (
        <Button
            fontWeight="400"
            fontSize="md"
            justifyContent="left"
            bg="gray.900"
            onClick={handleOnClick}
            _hover={{ bg: "rgba(255, 255, 255, 0.16)" }}
        >
            <Flex width="100%" alignItems="center">
                <Image mr="10px" src={src} boxSize={6} />
                {name}
                <Spacer />
                {isActiveConnector && <Image src={CheckSvg} />}
            </Flex>
        </Button>
    )
}

export default WalletButton
