import { BiconomyError, TxRejectError } from "../../util/error"
import React, { useEffect } from "react"
import { useCallback, useState } from "react"

import { BigNumber } from "ethers"
import { CHAIN_ID } from "connector"
import { Connection } from "container/connection"
import { ContractTransaction } from "@ethersproject/contracts"
import { ExternalLink } from "component/ExternalLink"
import { STORAGE_KEY } from "constant/storage"
import { TransactionReceipt } from "@ethersproject/providers"
import { User } from "../user"
import { createContainer } from "unstated-next"
import { getEtherscanTxLink } from "util/link"
import { logger } from "lib/bugsnag/logger"
import { useLocalStorage } from "hook/useLocalStorage"
import { useNotification } from "../../hook/useNotification"

export const Transaction = createContainer(useTransaction)

interface Msg {
    title?: string
    description?: string
}

interface LatestTx {
    action: string
    successMsg?: Msg
    errorMsg?: Msg
    infoMsg?: Msg
}

export enum TransactionAction {
    GENERAL = "general",
    APPROVE = "approve",
}

const defaultOption = {
    action: TransactionAction.GENERAL,
    successMsg: {
        title: "Transaction Succeed",
        description: "Amounts should be updated shortly.",
    },
    errorMsg: {
        title: "Transaction Failed",
        description: "",
    },
    infoMsg: {
        title: "Transaction Sent",
        description: "It might take a few minutes",
    },
}

const { LATEST_TX_DATA } = STORAGE_KEY
const MAX_RETRY_TIMES = 5

function useTransaction() {
    const [error, setError] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [receipts, setReceipts] = useState<TransactionReceipt[]>([])
    const { notifyError, notifySuccess, notifyInfo } = useNotification()
    const [latestTx, setLatestTx] = useState<LatestTx | null>(null)
    const [latestTxData, setLatestTxData] = useLocalStorage(LATEST_TX_DATA.name, LATEST_TX_DATA.defaultValue)
    const [isInitialized, setIsInitialized] = useState<boolean>(false)
    const {
        state: { address },
    } = User.useContainer()

    const { xDaiProvider, ethProvider, chainId } = Connection.useContainer()
    const provider = chainId === CHAIN_ID.XDai ? xDaiProvider : ethProvider

    const resetTxStatus = useCallback(() => {
        setIsLoading(false)
        setLatestTxData("")
    }, [setLatestTxData])

    // TODO: need to handle speed up case
    // monitor latestTx
    useEffect(() => {
        async function checkReceipt(triedTimes: number) {
            const { txHash, successTitle, successDesc } = JSON.parse(latestTxData)
            try {
                const receipt = await provider.getTransactionReceipt(txHash)
                if (receipt) {
                    resetTxStatus()
                    notifySuccess({
                        title: <ExternalLink href={getEtherscanTxLink(txHash)}>{successTitle}</ExternalLink>,
                        description: successDesc,
                    })
                } else if (triedTimes < MAX_RETRY_TIMES) {
                    logger.info("triedTimes", triedTimes)
                    setTimeout(() => {
                        checkReceipt(triedTimes + 1)
                    }, 2000)
                } else {
                    resetTxStatus()
                    notifyError({
                        title: <ExternalLink href={getEtherscanTxLink(txHash)}>Latest Receipt Not Found</ExternalLink>,
                        description: "",
                    })
                }
            } catch (err) {
                resetTxStatus()
                logger.error(err)
            }
        }
        if (!isInitialized) {
            setIsInitialized(true)
            if (latestTxData) {
                setIsLoading(true)
                checkReceipt(0)
            }
        }
    }, [resetTxStatus, isInitialized, latestTxData, notifyError, notifySuccess, provider, setLatestTxData])

    const preExecute = useCallback((option?: LatestTx) => {
        const infoTitle = option?.infoMsg?.title || defaultOption.infoMsg.title
        const infoDesc = option?.infoMsg?.description || defaultOption.infoMsg.description
        const successTitle = option?.successMsg?.title || defaultOption.successMsg.title
        const successDesc = option?.successMsg?.description || defaultOption.successMsg.description
        const errorTitle = option?.errorMsg?.title || defaultOption.errorMsg.title
        const errorDesc = option?.errorMsg?.description || defaultOption.errorMsg.description

        setError(null)
        setLatestTx({
            action: option?.action || defaultOption.action,
            infoMsg: { title: infoTitle, description: infoDesc },
            successMsg: { title: successTitle, description: successDesc },
            errorMsg: { title: errorTitle, description: errorDesc },
        })

        return {
            infoTitle,
            infoDesc,
            successTitle,
            successDesc,
            errorTitle,
            errorDesc,
        }
    }, [])

    const userConfirmTx = useCallback(
        async (txAction: Promise<ContractTransaction | string>, metaData: Record<string, string>) => {
            const { infoTitle, infoDesc, successTitle, successDesc } = metaData
            let tx, txHash
            let isRejected = false
            let isMetaTx = false
            try {
                setIsLoading(true)
                tx = await txAction
                isMetaTx = typeof tx === "string"
                txHash = isMetaTx ? (tx as string) : (tx as ContractTransaction).hash
                setLatestTxData(
                    JSON.stringify({
                        ...metaData,
                        txHash,
                    }),
                )
                if (!isMetaTx) {
                    notifyInfo({
                        title: <ExternalLink href={getEtherscanTxLink(txHash)}>{infoTitle}</ExternalLink>,
                        description: infoDesc,
                    })
                } else {
                    notifySuccess({
                        title: <ExternalLink href={getEtherscanTxLink(txHash)}>{successTitle}</ExternalLink>,
                        description: successDesc,
                    })
                }
            } catch (err) {
                if (err.code && err.code === 4001) {
                    // it means user reject this tx
                    isRejected = true
                    setError(new TxRejectError())
                    notifyError({
                        title: "Transaction Rejected",
                        description: "Please confirm transaction to continue.",
                    })
                } else if (err instanceof BiconomyError) {
                    // failed tx via biconomy
                    notifyError({
                        title: "Transaction Failed",
                        // description: `something wrong. please contact support`,
                    })
                    setError(err)
                }
                logger.error(err)
                resetTxStatus()
            }
            return {
                isRejected,
                isMetaTx,
                tx,
                txHash,
            }
        },
        [notifyInfo, notifySuccess, notifyError, setLatestTxData, resetTxStatus],
    )

    const execute = useCallback(
        async (txAction: Promise<ContractTransaction | string>, option?: LatestTx) => {
            const latestTxMetaData = preExecute(option)
            const { successTitle, successDesc, errorTitle, errorDesc } = latestTxMetaData

            let receipt: TransactionReceipt | null = null
            const { tx, isRejected, isMetaTx, txHash } = await userConfirmTx(txAction, latestTxMetaData)

            if (isRejected || isMetaTx) {
                // NOTE: both cases are handled in `userConfirmTx`
                // TODO: should interleave meta tx and contract tx
                return
            }

            try {
                receipt = await (tx as ContractTransaction).wait()
                setReceipts(prev => [...prev, receipt as TransactionReceipt])
                notifySuccess({
                    title: <ExternalLink href={getEtherscanTxLink(txHash)}>{successTitle}</ExternalLink>,
                    description: successDesc,
                })
            } catch (err) {
                logger.error(err)
                setError(err)
                notifyError({
                    title: <ExternalLink href={getEtherscanTxLink(txHash)}>{errorTitle}</ExternalLink>,
                    description: errorDesc,
                })
            }
            resetTxStatus()
            return receipt
        },
        [notifyError, notifySuccess, preExecute, resetTxStatus, userConfirmTx],
    )

    const executeWithGasLimit = useCallback(
        async (contract, funcName, args, option?: LatestTx) => {
            const overrides = { from: address }
            const gasLimitRatio = BigNumber.from(2)
            let gasLimit: BigNumber
            let receipt: TransactionReceipt | undefined | null = null

            try {
                gasLimit = await contract.estimateGas[funcName](...args, overrides)
                receipt = await execute(
                    contract[funcName](...args, { ...overrides, gasLimit: gasLimitRatio.mul(gasLimit) }),
                    option,
                )
            } catch (err) {
                logger.error(err)
                setError(err)
            }
            return receipt
        },
        [execute, address],
    )

    return {
        error,
        receipts,
        isLoading,
        execute,
        executeWithGasLimit,
        latestTx,
    }
}
