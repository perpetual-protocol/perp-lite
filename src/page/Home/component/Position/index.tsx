import { SimpleGrid } from "@chakra-ui/layout"
import React from "react"
import PositionUnit from "./component/PositionUnit"

function Position() {
    return (
        <SimpleGrid columns={1} spacing={8}>
            <PositionUnit />
            <PositionUnit />
            <PositionUnit />
            <PositionUnit />
            <PositionUnit />
        </SimpleGrid>
    )
}

export default Position
