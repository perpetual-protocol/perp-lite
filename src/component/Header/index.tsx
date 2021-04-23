import { Container, Flex, Heading, Spacer } from "@chakra-ui/react"
import React from "react"
import { Link } from "react-router-dom"
import ConnectBtn from "./ConnectBtn"

function Header() {
    return (
        <Container h="64px">
            <Flex h="100%" alignItems="center">
                <Link to="/">
                    <Heading size="md">PERP Lite</Heading>
                </Link>
                <Spacer />
                <ConnectBtn />
            </Flex>
        </Container>
    )
}

export default Header
