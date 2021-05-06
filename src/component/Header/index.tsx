import { Container, Flex, Heading, Spacer } from "@chakra-ui/react"
import React from "react"
import { Link } from "react-router-dom"
import ConnectBtn from "./ConnectBtn"

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
