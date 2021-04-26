import { ButtonGroup, Button } from "@chakra-ui/react"
import React, { useCallback } from "react"
import { Trade } from "page/Home/container/trade"

function SideSwitcher() {
    const { side, setSide } = Trade.useContainer()

    const handleLongOnClick = useCallback(() => {
        if (side !== 1) {
            setSide(1)
        }
    }, [setSide, side])

    const handleShortOnClick = useCallback(() => {
        if (side !== 0) {
            setSide(0)
        }
    }, [setSide, side])

    return (
        <ButtonGroup w="100%" isAttached variant="solid">
            <Button
                size="sm"
                isFullWidth
                onClick={handleLongOnClick}
                colorScheme={side === 1 ? "green" : "gray"}
                mr="-px"
                variant="solid"
            >
                Long
            </Button>
            <Button size="sm" isFullWidth onClick={handleShortOnClick} colorScheme={side === 0 ? "red" : "gray"}>
                Short
            </Button>
        </ButtonGroup>
    )
}

export default SideSwitcher
