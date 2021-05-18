import { big2Decimal, bigNum2Big, decimal2Big } from "util/format"
import { useCallback, useEffect, useMemo, useState } from "react"

import { AmmError } from "util/error"
import Big from "big.js"
import { Connection } from "container/connection"
import { Contract } from "container/contract"
import { Dir } from "constant"
import { Contract as MulticallContract } from "ethers-multicall"
import { isAddress } from "@ethersproject/address"
import { useContractEvent } from "./useContractEvent"

export function useRealtimeAmm(address: string, name: string) {
    const { xDaiMulticallProvider } = Connection.useContainer()
    const { amm } = Contract.useContainer()
    const [baseAssetReserve, setBaseAssetReserve] = useState<Big | null>(null)
    const [quoteAssetReserve, setQuoteAssetReserve] = useState<Big | null>(null)

    const contract = useMemo(() => {
        return isAddress(address) ? amm?.attach(address) || null : null
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

    useEffect(() => {
        async function getAssetReserve() {
            if (xDaiMulticallProvider !== null && amm !== null && isAddress(address)) {
                const multiContract = new MulticallContract(address, amm.interface.fragments)
                const [quoteAssetReserve, baseAssetReserve] = await xDaiMulticallProvider.all([
                    multiContract.quoteAssetReserve(),
                    multiContract.baseAssetReserve(),
                ])
                setQuoteAssetReserve(bigNum2Big(quoteAssetReserve))
                setBaseAssetReserve(bigNum2Big(baseAssetReserve))
            }
        }
        getAssetReserve()
    }, [address, amm, xDaiMulticallProvider])

    /* will receive [quoteAssetReserve, baseAssetReserve, timestamp] */
    useContractEvent(contract, "ReserveSnapshotted", (quoteAssetReserve, baseAssetReserve, _) => {
        setQuoteAssetReserve(bigNum2Big(quoteAssetReserve))
        setBaseAssetReserve(bigNum2Big(baseAssetReserve))
    })

    return {
        contract,
        baseAssetReserve,
        quoteAssetReserve,
        getInputPrice,
        getOutputPrice,
    }
}
