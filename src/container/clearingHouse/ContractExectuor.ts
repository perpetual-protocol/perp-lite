import { BigNumber, ContractTransaction, Signer } from "ethers"
import { Dir, Decimal } from "constant"
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
        // const gasLimitRatio = BigNumber.from(2)
        // let gasLimit: BigNumber

        // @ts-ignore
        // const functionSignature = this.contract.interface.encodeFunctionData(funcName, args)

        // try {
        //     // @ts-ignore
        //     gasLimit = await this.contract.estimateGas[funcName](...args, overrides)
        // } catch (e) {
        //     const metadataSet: LogMetadataSet = {
        //         payload: {
        //             functionSignature,
        //             to: this.contract.address,
        //             from: overrides.from,
        //         },
        //     }
        //     console.log(e)
        //     logger.error(e, metadataSet)
        //     throw e
        // }

        // @TODO: hard code the gasLimit, until estimateGas function can always return a reasonable number
        // return this.contract[funcName](...args, { ...overrides, gasLimit: gasLimitRatio.mul(gasLimit) })
        return this.contract[funcName](...args, {
            ...overrides,
            gasLimit: BigNumber.from(3_800_000),
            // Instead of using a lower customized gas price, we use the default gas price which is provided by the metamask.
            // gasPrice: utils.parseUnits("2", "gwei"),
        })
    }
}
