import { BigNumber } from "ethers"

const MAX_GAS_LIMIT = 12500000

// These error classes will be used in the future when we refactor the error handling logic
export class ExceedMaximumGasLimitError extends Error {
    public gasLimit: BigNumber
    constructor(gasLimit: BigNumber) {
        super()
        this.name = `ExceedMaximumGasLimitError`
        this.message = `The estimated gas limit ${gasLimit.toString()} is too high, which is larger than ${MAX_GAS_LIMIT}. Please contact our support.`
        this.gasLimit = gasLimit
    }
}

export class EstimateGasError extends Error {
    constructor(funcName: string) {
        super()
        this.name = `EstimateGasError`
        this.message = `EstimatedGas for function "${funcName}" failed. Please contact our support.`
    }
}

export class BiconomyError extends Error {
    constructor(message: string) {
        super()
        this.name = `BiconomyError`
        this.message = `${message}`
    }
}