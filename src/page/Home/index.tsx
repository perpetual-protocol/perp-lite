import React from "react"
import { Box } from "@chakra-ui/react"
import { User } from "../../container/user"

const Home = () => {
    const {
        state: { address },
    } = User.useContainer()

    return (
        <Box bg="#E0E0E0" height="100vh" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            Hello {address}!
        </Box>
    )
}

export default Home
