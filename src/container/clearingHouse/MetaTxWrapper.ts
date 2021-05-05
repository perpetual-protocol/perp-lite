import { BigNumber, Contract, providers } from "ethers"
import { TypedDataUtils } from "ethers-eip712"
import { hexlify } from "ethers/lib/utils"
import { TypedData } from "./type"
import { CHAIN_ID } from "../../connector"
import { trackSendTxToFuncRequest, trackSendTxToFuncSent } from "lib/segment"
import { MetaTxGateway } from "types/contracts"
import { BiconomyError } from "util/error"
import { permittableTokenABI } from "constant"
import { LedgerProvider } from "connector"
import { logger, LogMetadataSet } from "lib/errorReport"
import { IS_MAINNET } from "../../constant"

const metaTxUrl = "https://api.biconomy.io/api/v2/meta-tx/native"

export interface BiconomyResponse {
    code: number
    flag: number
    log: string
    message: string
    txHash?: string
    error?: string
}

export interface BiconomyRequest {
    userAddress: string
    apiId: string
    params: any[]
    gasLimit?: string
}

interface MetaTxMessage {
    from?: string | null
    to: string
    functionSignature: string
    nonce: number
}

interface PermitMessage {
    holder: string
    spender: string
    nonce: number
    expiry: number
    allowed: boolean
}

type PropType<TObj, TProp extends keyof TObj> = TObj[TProp]

type SignMethod = "eth_sign" | "eth_signTypedData_v4"

export interface TypedProp {
    name: string
    type: string
}

interface RSV {
    r: string
    s: string
    v: number
}

function getRSVBySignature(signature: string): RSV {
    const trimmed = signature.substring(2)
    const r = "0x" + trimmed.substring(0, 64)
    const s = "0x" + trimmed.substring(64, 128)
    const v = parseInt(trimmed.substring(128, 130), 16)
    return { r, s, v }
}

export class MetaTxWrapper {
    readonly biconomyApiKey: string
    readonly biconomyGatewayApiId: string
    readonly biconomyTokenApiId: string
    readonly layer1Provider: providers.Web3Provider | providers.BaseProvider
    readonly layer2Provider: providers.BaseProvider
    readonly contract: Contract
    readonly metaTxSupport: boolean
    readonly metaTxGateway?: MetaTxGateway
    readonly account: string | undefined
    readonly estimate: PropType<Contract, "estimate">
    readonly filters: PropType<Contract, "filters">
    readonly interface: PropType<Contract, "interface">
    readonly on: PropType<Contract, "on">
    readonly removeListener: PropType<Contract, "removeListener">
    readonly address: PropType<Contract, "address">
    readonly gasLimitRatio: BigNumber

    constructor(
        biconomyApiKey: string,
        biconomyGatewayApiId: string,
        biconomyTokenApiId: string,
        layer1Provider: providers.Web3Provider | providers.BaseProvider,
        layer2Provider: providers.BaseProvider,
        contract: Contract,
        supportMetaTx = false,
        metaTxGateway?: MetaTxGateway,
        account?: string | null,
        gasLimitRatio = BigNumber.from(2),
    ) {
        this.biconomyApiKey = biconomyApiKey
        this.biconomyGatewayApiId = biconomyGatewayApiId
        this.biconomyTokenApiId = biconomyTokenApiId
        this.layer1Provider = layer1Provider
        this.layer2Provider = layer2Provider
        this.contract = contract
        this.metaTxSupport = supportMetaTx
        this.metaTxGateway = metaTxGateway
        this.account = account || undefined
        this.estimate = contract.estimate
        this.filters = contract.filters
        this.interface = contract.interface
        this.address = contract.address
        this.on = contract.on.bind(contract)
        this.removeListener = contract.removeListener.bind(contract)
        this.gasLimitRatio = gasLimitRatio
    }

    getTypedData<T>(
        primaryType: string,
        name: string,
        chainId: number,
        verifyingContract: string,
        message: T,
    ): TypedData<T> {
        const typedDataTemplate = {
            types: {
                EIP712Domain: [
                    { name: "name", type: "string" },
                    { name: "version", type: "string" },
                    { name: "chainId", type: "uint256" },
                    { name: "verifyingContract", type: "address" },
                ],
                MetaTransaction: [
                    { name: "nonce", type: "uint256" },
                    { name: "from", type: "address" },
                    { name: "to", type: "address" },
                    { name: "functionSignature", type: "bytes" },
                ],
                Permit: [
                    { name: "holder", type: "address" },
                    { name: "spender", type: "address" },
                    { name: "nonce", type: "uint256" },
                    { name: "expiry", type: "uint256" },
                    { name: "allowed", type: "bool" },
                ],
            },
            primaryType,
            domain: {
                name,
                version: "1",
                chainId,
                verifyingContract,
            },
        }

        return {
            ...typedDataTemplate,
            message,
        }
    }

    async sendTxToFunction(funcName: string, args: any[]): Promise<string> {
        trackSendTxToFuncRequest(funcName, args)
        let txHash = ""

        if (this.metaTxSupport) {
            const functionSignature = this.contract.interface.encodeFunctionData(funcName, args)
            const overrides = { from: this.account }
            const gasLimit = await this.contract.estimateGas[funcName](...args, overrides)
            const increasedLimit = gasLimit.mul(this.gasLimitRatio)
            const maxGasLimit = 3_800_000
            txHash = await this.executeMetaTxGateway(
                functionSignature,
                increasedLimit.gt(maxGasLimit) ? BigNumber.from(maxGasLimit) : increasedLimit,
            )
        } else {
            const tx = await this.contract[funcName](...args)
            txHash = tx.hash || ""
        }
        trackSendTxToFuncSent(funcName, args)

        return txHash
    }

    async sign(typedData: TypedData<any>, signMethod: SignMethod) {
        let signature

        if (this.layer1Provider instanceof LedgerProvider) {
            // TODO: might not support ledger
            // signature = await this.layer1Provider.getLedgerSigner().signEip712Message(typedData)
        } else if (signMethod === "eth_sign") {
            const digest = TypedDataUtils.encodeDigest(typedData)
            const digestHex = hexlify(digest)
            signature = await (window as any).ethereum.request({
                method: signMethod,
                params: [this.account, digestHex],
            })
        } else if (signMethod === "eth_signTypedData_v4" && this.layer1Provider instanceof providers.Web3Provider) {
            signature = await this.layer1Provider.send(signMethod, [this.account, JSON.stringify(typedData)])
        } else if (!(this.layer1Provider instanceof providers.Web3Provider)) {
            throw new Error("Invalid provider")
        } else {
            throw new Error("Invalid sign method.")
        }
        return getRSVBySignature(signature)
    }

    async executeMetaTxGateway(functionSignature: string, gasLimit: BigNumber): Promise<string> {
        const nonce = (await this.metaTxGateway!.getNonce(this.account!)).toNumber()
        const message: MetaTxMessage = {
            from: this.account,
            to: this.contract.address,
            functionSignature,
            nonce,
        }

        const typedData = this.getTypedData(
            "MetaTransaction",
            "Perp",
            IS_MAINNET ? CHAIN_ID.Ethereum : CHAIN_ID.Rinkeby,
            this.metaTxGateway!.address,
            message,
        )
        const { r, s, v } = await this.sign(typedData, "eth_signTypedData_v4")

        const body: BiconomyRequest = {
            userAddress: this.account!,
            apiId: this.biconomyGatewayApiId,
            params: [message.from, message.to, message.functionSignature, r, s, v],
            gasLimit: gasLimit.toHexString(),
        }

        return this.send(body, message)
    }

    async permit(spender: string): Promise<string> {
        const contract = new Contract(this.contract.address, permittableTokenABI, this.contract.provider)
        const nonce = (await contract.nonces(this.account!)).toNumber()
        const name = await this.contract.name()
        const message: PermitMessage = {
            holder: this.account!,
            spender,
            nonce,
            expiry: 0,
            allowed: true,
        }
        const typedData = this.getTypedData(
            "Permit",
            name,
            IS_MAINNET ? CHAIN_ID.Ethereum : CHAIN_ID.Rinkeby,
            this.contract.address,
            message,
        )
        const { r, s, v } = await this.sign(typedData, "eth_sign")
        const { holder, expiry, allowed } = typedData.message
        const body: BiconomyRequest = {
            userAddress: this.account!,
            apiId: this.biconomyTokenApiId,
            params: [holder, spender, nonce, expiry, allowed, v, r, s],
        }

        return this.send(body)
    }

    async send(body: BiconomyRequest, message?: MetaTxMessage): Promise<string> {
        const options = {
            headers: {
                "content-type": "application/json;charset=UTF-8",
                "x-api-key": this.biconomyApiKey,
            },
            body: JSON.stringify(body),
            method: "POST",
        }
        const blockNumber = await this.layer2Provider.getBlockNumber()
        const res = (await fetch(metaTxUrl, options).then(res => res.json())) as BiconomyResponse
        if (res.flag !== 200) {
            const metadataSet: LogMetadataSet = {
                payload: {
                    biconomyRequestBody: body,
                    signedMessage: message,
                    blockNumber,
                },
            }
            // TODO:
            // Currently, we will send error to bugsnag 2 times, one is reported here,
            // and the other is reported in `sendTx` in `useTx.ts`. Therefore,
            // we should put this metadataset into BiconomyError and handle error generally in useTx
            // to eliminate these duplicated error message.
            const error = new BiconomyError(res.message || res.log || "")
            logger.error(error, metadataSet)

            // TODO:
            // currently the default error message is `Something wrong....` (in useTx.ts)
            // we will handle biconomy error respectively by biconomy error code later
            throw error
        }
        logger.log(res)
        return res.txHash || ""
    }
}
