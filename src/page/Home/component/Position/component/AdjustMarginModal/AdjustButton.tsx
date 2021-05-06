import { Button } from "@chakra-ui/react"
import { isAddress } from "@ethersproject/address"
import { MarginDir } from "constant"
import { ClearingHouse } from "container/clearingHouse"
import { Transaction } from "container/transaction"
import { useCallback } from "react"
import { big2BigNum } from "util/format"
import { Margin } from "./container/margin"

interface AdjustButtonProps {
    address: string
}

function AdjustButton({ address }: AdjustButtonProps) {
    const { addMargin, removeMargin } = ClearingHouse.useContainer()
    const { marginDir, margin } = Margin.useContainer()
    const { isLoading: isTxLoading } = Transaction.useContainer()

    const handleOnClick = useCallback(() => {
        if (!isAddress(address) || margin === null) {
            return
        }
        if (marginDir === MarginDir.Add) {
            addMargin(address, big2BigNum(margin))
        } else if (marginDir === MarginDir.Reduce) {
            removeMargin(address, big2BigNum(margin))
        }
    }, [addMargin, address, margin, marginDir, removeMargin])

    return (
        <Button isFullWidth colorScheme="blue" size="md" onClick={handleOnClick} isLoading={isTxLoading}>
            Adjust
        </Button>
    )
}

export default AdjustButton
