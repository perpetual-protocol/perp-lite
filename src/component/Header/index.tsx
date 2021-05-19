import { Flex, Heading, Spacer } from "@chakra-ui/react"

import ConnectBtn from "./ConnectBtn"
import { Link } from "react-router-dom"
import React from "react"

function Header() {
    return (
        <Flex h="64px" alignItems="center">
            <Link to="/">
                <Heading size="md">PERP Lite</Heading>
            </Link>
            <Spacer />
            <ConnectBtn />
        </Flex>
    )
}

export default Header
