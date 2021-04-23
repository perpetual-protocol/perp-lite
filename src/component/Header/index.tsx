import { Container, Divider, Flex, Image, Spacer, Stack, Heading } from "@chakra-ui/react"
import React from "react"
import { Link } from "react-router-dom"
import LogoColorSvg from "../../asset/logo/logo-color.svg"
import ConnectBtn from "./ConnectBtn"

function Header() {
    return (
        <Container h="64px">
            <Flex h="100%" alignItems="center">
                <Link to="/">
                    <Stack direction="row" alignItems="center">
                        <Image h="32px" w="32px" src={LogoColorSvg} />
                        <Divider h="24px" marginLeft="10" orientation="vertical" />
                        <Heading size="sm">Dapp boilerplate</Heading>
                    </Stack>
                </Link>
                <Spacer />
                <ConnectBtn />
            </Flex>
        </Container>
    )
}

export default Header
