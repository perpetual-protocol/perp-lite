import { BigNumber, ContractTransaction, Signer } from "ethers"
import { Decimal, Dir } from "constant"

import { ClearingHouse } from "types/contracts"
import { ClearingHouseActions } from "./type"

export class ContractExecutor implements ClearingHouseActions {
    constructor(readonly contract: ClearingHouse, readonly signer: Signer | undefined) {
        if (signer) {
            this.contract = contract.connect(signer)
        }
    }

    addMargin(ammAddress: string, increaseMargin: Decimal): Promise<ContractTransaction> {
        return this.execute("addMargin", [ammAddress, increaseMargin])
    }

    adjustPosition(ammAddress: string): Promise<ContractTransaction> {
        return this.execute("adjustPosition", [ammAddress])
    }

    closePosition(ammAddress: string, quoteAssetAmountLimit: Decimal): Promise<ContractTransaction> {
        return this.execute("closePosition", [ammAddress, quoteAssetAmountLimit])
    }

    openPosition(
        ammAddress: string,
        dir: Dir,
        quoteAssetAmount: Decimal,
        leverage: Decimal,
        minBaseAssetAmount: Decimal,
    ): Promise<ContractTransaction> {
        return this.execute("openPosition", [ammAddress, dir, quoteAssetAmount, leverage, minBaseAssetAmount])
    }

    removeMargin(ammAddress: string, decreaseMargin: Decimal): Promise<ContractTransaction> {
        return this.execute("removeMargin", [ammAddress, decreaseMargin])
    }

    async execute(funcName: string, args: any[]) {
        const overrides = { from: this.contract.signer.getAddress() }

        return this.contract[funcName](...args, {
            ...overrides,
            // NOTE: hard code the gasLimit, until estimateGas function can always return a reasonable number.
            gasLimit: BigNumber.from(3_800_000),
            // NOTE: Instead of using a lower customized gas price, we use the default gas price which is provided by the metamask.
            // gasPrice: utils.parseUnits("2", "gwei"),
        })
    }
}
