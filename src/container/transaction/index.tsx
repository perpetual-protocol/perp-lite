import React, { useEffect } from "react"
import { createContainer } from "unstated-next"
import { TransactionReceipt } from "@ethersproject/providers"
import { useState, useCallback } from "react"
import { useNotification } from "../../hook/useNotification"
import { getEtherscanTxLink } from "util/link"
import { ExternalLink } from "component/ExternalLink"
import { ContractTransaction } from "@ethersproject/contracts"
import { User } from "../user"
import { BigNumber } from "ethers"
import { useLocalStorage } from "hook/useLocalStorage"
import { STORAGE_KEY } from "constant/storage"
import { Connection } from "container/connection"
import { CHAIN_ID } from "connector"

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

class TxRejectError extends Error {
    constructor() {
        super()
        this.name = "Transaction Reject Error"
        this.message = ""
    }
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
                    console.log("triedTimes", triedTimes)
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
                console.log("debug:", "err", err)
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

    const execute = useCallback(
        async (txAction: Promise<ContractTransaction>, option?: LatestTx) => {
            const latestTxMetaData = preExecute(option)
            const { infoTitle, infoDesc, successTitle, successDesc, errorTitle, errorDesc } = latestTxMetaData

            let receipt: TransactionReceipt | null = null
            let tx
            try {
                setIsLoading(true)
                tx = await txAction
                setLatestTxData(
                    JSON.stringify({
                        ...latestTxMetaData,
                        txHash: tx.hash,
                    }),
                )
                notifyInfo({
                    title: <ExternalLink href={getEtherscanTxLink(tx.hash)}>{infoTitle}</ExternalLink>,
                    description: infoDesc,
                })
            } catch (e) {
                console.log(e)
                setError(new TxRejectError())
                resetTxStatus()
                notifyError({ title: "Transaction Rejected", description: "Please confirm transaction to continue." })
                return
            }

            try {
                receipt = await tx.wait()
                setReceipts(prev => [...prev, receipt as TransactionReceipt])
                resetTxStatus()
                notifySuccess({
                    title: <ExternalLink href={getEtherscanTxLink(tx.hash)}>{successTitle}</ExternalLink>,
                    description: successDesc,
                })
            } catch (e) {
                console.log(e)
                setError(e)
                resetTxStatus()
                notifyError({
                    title: <ExternalLink href={getEtherscanTxLink(tx.hash)}>{errorTitle}</ExternalLink>,
                    description: errorDesc,
                })
            }
            return receipt
        },
        [notifyError, notifyInfo, notifySuccess, preExecute, resetTxStatus, setLatestTxData],
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
            } catch (e) {
                setError(e)
                console.log(e)
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
