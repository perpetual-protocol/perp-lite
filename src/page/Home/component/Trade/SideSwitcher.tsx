import { ButtonGroup, Button } from "@chakra-ui/react"
import { useCallback } from "react"
import { Trade } from "container/trade"
import { Side } from "constant"

function SideSwitcher() {
    const { side, setSide } = Trade.useContainer()

    const handleLongOnClick = useCallback(() => {
        if (side !== Side.Long) {
            setSide(Side.Long)
        }
    }, [setSide, side])

    const handleShortOnClick = useCallback(() => {
        if (side !== Side.Short) {
            setSide(Side.Short)
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
