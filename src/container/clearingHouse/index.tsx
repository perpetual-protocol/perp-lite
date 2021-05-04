import { createContainer } from "unstated-next"
import { Big } from "big.js"
import { Contract } from "../contract"
import { Connection } from "../connection"
import { Dir, Network } from "../../constant"
import { ClearingHouseActions } from "./type"
import { MetaTxExecutor } from "./MetaTxExecutor"
import { ContractExecutor } from "./ContractExectuor"
import { useCallback, useMemo } from "react"
import { CHAIN_ID } from "../../connector"
import { exec } from "child_process"
import { Transaction } from "../transaction"
import { big2Decimal, decimal2Big } from "../../util/format"
import { BigNumber } from "ethers"

export const ClearingHouse = createContainer(useClearingHouse)

export interface Executors {
    [Network.Ethereum]: ClearingHouseActions
    [Network.Xdai]: ClearingHouseActions
}

const { REACT_APP_BICONOMY_API_KEY, REACT_APP_BICONOMY_GATEWAY_API_ID, REACT_APP_BICONOMY_TOKEN_API_ID } = process.env

function useClearingHouse() {
    const { ethProvider, xDaiProvider, chainId, account, signer } = Connection.useContainer()
    const { clearingHouse, metaTxGateway } = Contract.useContainer()
    const { execute } = Transaction.useContainer()

    const executors: Executors | null = useMemo(() => {
        if (!clearingHouse || !metaTxGateway || !signer) {
            return null
        }
        return {
            [Network.Ethereum]: new MetaTxExecutor(
                REACT_APP_BICONOMY_API_KEY!,
                REACT_APP_BICONOMY_GATEWAY_API_ID!,
                REACT_APP_BICONOMY_TOKEN_API_ID!,
                ethProvider,
                xDaiProvider,
                clearingHouse,
                true,
                metaTxGateway,
                account,
            ),
            [Network.Xdai]: new ContractExecutor(clearingHouse, signer),
        }
    }, [clearingHouse, metaTxGateway])

    // NOTE:
    // If we support `?network=100` in this app, we can use this information to determine
    // which executor we will use. Currently, we use xdai executor as default.
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
                // TODO: refactor this { d: } type
                execute(currentExecutor.addMargin(ammAddress, { d: increaseMargin }))
            }
        },
        [currentExecutor, execute],
    )

    const removeMargin = useCallback(
        (ammAddress: string, reduceMargin: BigNumber) => {
            if (currentExecutor) {
                // TODO: refactor this { d: } type
                execute(currentExecutor.removeMargin(ammAddress, { d: reduceMargin }))
            }
        },
        [currentExecutor, execute],
    )

    // TODO:
    // read
    // getMarginRatio(ammAddress, account)
    // maintenanceMarginRatio() // fixed
    // getOpenInterestNotionalMap(ammAddress) // for all amms

    return {
        openPosition,
        closePosition,
        addMargin,
        removeMargin,
    }
}
