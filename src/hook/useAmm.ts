import Big from "big.js"
import { Dir } from "constant"
import { Contract } from "container/contract"
import { useCallback, useMemo } from "react"
import { AmmError } from "util/error"
import { decimal2Big, big2Decimal } from "util/format"

export function useAmm(address: string, name: string) {
    const { amm } = Contract.useContainer()

    const contract = useMemo(() => {
        return address ? amm?.attach(address) || null : null
    }, [amm, address])

    const getInputPrice = useCallback(
        async (dir: Dir, notional: Big): Promise<Big | null> => {
            if (contract) {
                try {
                    return decimal2Big(await contract.getInputPrice(dir, big2Decimal(notional)))
                } catch (err) {
                    throw new AmmError(name, "GetInputPrice", address)
                }
            }
            return null
        },
        [address, contract, name],
    )

    const getOutputPrice = useCallback(
        async (size: Big): Promise<Big | null> => {
            if (contract) {
                try {
                    const dir: Dir = size.gt(0) ? Dir.AddToAmm : Dir.RemoveFromAmm
                    return decimal2Big(await contract.getOutputPrice(dir, big2Decimal(size.abs())))
                } catch (err) {
                    throw new AmmError(name, "GetOutputPrice", address)
                }
            }
            return null
        },
        [address, contract, name],
    )

    return {
        contract,
        getInputPrice,
        getOutputPrice,
    }
}
