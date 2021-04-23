import React from "react"
import { Button } from "@chakra-ui/react"
import WalletFill from "../Icon/WalletFill"
import { Global } from "container/global"
import { getShortenAccount } from "util/getShortenAddress"
import { User } from "container/user"

function ConnectBtn() {
    const {
        state: { address },
    } = User.useContainer()

    const {
        actions: { toggleWalletModal },
    } = Global.useContainer()

    return (
        <Button
            size="sm"
            onClick={toggleWalletModal}
            colorScheme="gray"
            variant="outline"
            leftIcon={<WalletFill boxSize={4} />}
        >
            {address ? getShortenAccount(address) : "Connect"}
        </Button>
    )
}

export default ConnectBtn
