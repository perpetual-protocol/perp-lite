import { createContainer } from "unstated-next"
import { MarginDir } from "constant"
import { useState } from "react"
import Big from "big.js"

export const Margin = createContainer(useMargin)

function useMargin() {
    const [marginDir, setMarginDir] = useState<MarginDir>(MarginDir.Add)
    const [margin, setMargin] = useState<Big | null>(null)

    return {
        marginDir,
        setMarginDir,
        margin,
        setMargin,
    }
}
