import { ButtonGroup, Button } from "@chakra-ui/react"
import { MarginDir } from "constant"
import { Margin } from "./container/margin"

function MarginDirSwitcher() {
    const { marginDir, setMarginDir } = Margin.useContainer()

    return (
        <ButtonGroup w="100%" isAttached variant="solid">
            <Button
                size="sm"
                isFullWidth
                onClick={() => setMarginDir(MarginDir.Add)}
                colorScheme={marginDir === MarginDir.Add ? "green" : "gray"}
                mr="-px"
                variant="solid"
            >
                Add
            </Button>
            <Button
                size="sm"
                isFullWidth
                onClick={() => setMarginDir(MarginDir.Reduce)}
                colorScheme={marginDir === MarginDir.Reduce ? "red" : "gray"}
            >
                Reduce
            </Button>
        </ButtonGroup>
    )
}

export default MarginDirSwitcher
