import { Dir, Network } from "../../constant"
import { big2Decimal, bigNum2Decimal } from "util/format"
import { useCallback, useMemo } from "react"

import { Big } from "big.js"
import { BigNumber } from "ethers"
import { ClearingHouseActions } from "./type"
import { Connection } from "../connection"
import { Contract } from "../contract"
import { ContractExecutor } from "./ContractExecutor"
import { Transaction } from "../transaction"
import { createContainer } from "unstated-next"

export const ClearingHouse = createContainer(useClearingHouse)

export interface Executors {
    [Network.Xdai]: ClearingHouseActions
}

function useClearingHouse() {
    const { signer } = Connection.useContainer()
    const { clearingHouse, metaTxGateway } = Contract.useContainer()
    const { execute } = Transaction.useContainer()

    const executors: Executors | null = useMemo(() => {
        if (!clearingHouse || !metaTxGateway || !signer) {
            return null
        }
        return {
            [Network.Xdai]: new ContractExecutor(clearingHouse, signer),
        }
    }, [clearingHouse, metaTxGateway, signer])

    const currentExecutor = useMemo(() => {
        return executors ? executors[Network.Xdai] : null
    }, [executors])

    const closePosition = useCallback(
        (ammAddress: string, quoteAssetAmountLimit: Big) => {
            if (currentExecutor) {
                execute(currentExecutor.closePosition(ammAddress, big2Decimal(quoteAssetAmountLimit)))
            }
        },
        [currentExecutor, execute],
    )

    const openPosition = useCallback(
        (dir: Dir, ammAddress: string, quoteAssetAmount: Big, leverage: Big, minBaseAssetAmount: Big) => {
            if (currentExecutor) {
                execute(
                    currentExecutor.openPosition(
                        ammAddress,
                        dir,
                        big2Decimal(quoteAssetAmount),
                        big2Decimal(leverage),
                        big2Decimal(minBaseAssetAmount),
                    ),
                )
            }
        },
        [currentExecutor, execute],
    )

    const addMargin = useCallback(
        (ammAddress: string, increaseMargin: BigNumber) => {
            if (currentExecutor) {
                const d_increaseMargin = bigNum2Decimal(increaseMargin)
                execute(currentExecutor.addMargin(ammAddress, d_increaseMargin))
            }
        },
        [currentExecutor, execute],
    )

    const removeMargin = useCallback(
        (ammAddress: string, reduceMargin: BigNumber) => {
            if (currentExecutor) {
                const d_reduceMargin = bigNum2Decimal(reduceMargin)
                execute(currentExecutor.removeMargin(ammAddress, d_reduceMargin))
            }
        },
        [currentExecutor, execute],
    )

    return {
        openPosition,
        closePosition,
        addMargin,
        removeMargin,
    }
}
