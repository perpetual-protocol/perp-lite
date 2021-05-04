import { Contract } from "container/contract"
import { useMemo } from "react"
import { useContractCall } from "./useContractCall"

export function useAmm(address: string) {
    const { amm } = Contract.useContainer()

    const contract = useMemo(() => {
        return amm?.attach(address) || null
    }, [amm, address])

    const open = useContractCall(async () => {
        if (contract) {
            const isOpen = await contract.open()
            return isOpen
        }
    }, [contract])

    return {
        contract,
        open,
    }
}
