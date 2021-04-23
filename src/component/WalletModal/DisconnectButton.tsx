import React, { useCallback } from "react"
import { Button } from "@chakra-ui/react"
import { User } from "container/user"
import { Global } from "container/global"

function DisconnectButton() {
    const {
        actions: { logout },
    } = User.useContainer()

    const {
        actions: { toggleWalletModal },
    } = Global.useContainer()

    const handleOnClick = useCallback(() => {
        logout()
        toggleWalletModal()
    }, [logout, toggleWalletModal])

    return (
        <Button
            fontWeight="400"
            fontSize="md"
            justifyContent="left"
            bg="gray.900"
            color="red.500"
            onClick={handleOnClick}
            _hover={{ bg: "rgba(255, 255, 255, 0.16)" }}
        >
            Disconnect
        </Button>
    )
}

export default DisconnectButton
