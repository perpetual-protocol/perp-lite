import { ContractTransaction } from "ethers"
import { Dir, Decimal } from "constant"

type ReturnType = ContractTransaction | string

export interface ClearingHouseActions {
    addMargin(ammAddress: string, increaseMargin: Decimal): Promise<ReturnType>

    removeMargin(ammAddress: string, decreaseMargin: Decimal): Promise<ReturnType>

    openPosition(
        ammAddress: string,
        dir: Dir,
        quoteAssetAmount: Decimal,
        leverage: Decimal,
        minBaseAssetAmount: Decimal,
    ): Promise<ReturnType>

    closePosition(ammAddress: string, quoteAssetAmountLimit: Decimal): Promise<ReturnType>

    adjustPosition(ammAddress: string): Promise<ReturnType>
}

export interface TypedData<T> {
    types: Record<string, any[]>
    primaryType: string
    domain: Record<string, any>
    message: T
}
