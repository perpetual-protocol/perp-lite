import { MetaTxWrapper } from "./MetaTxWrapper"
import { Decimal, Dir } from "constant"
import { providers, Contract } from "ethers"
import { MetaTxGateway } from "types/contracts"

import { ClearingHouseActions } from "./type"

export class MetaTxExecutor extends MetaTxWrapper implements ClearingHouseActions {
    constructor(
        biconomyApiKey: string,
        biconomyGatewayApiId: string,
        biconomyTokenApiId: string,
        layer1Provider: providers.Web3Provider | providers.BaseProvider,
        layer2Provider: providers.BaseProvider,
        contract: Contract,
        supportMetaTx = true,
        metaTxGateway?: MetaTxGateway,
        account?: string | null,
    ) {
        if (biconomyApiKey || biconomyGatewayApiId || biconomyTokenApiId) {
            console.error("Meta Transaction Executor is not initialized correctly")
        }

        super(
            biconomyApiKey,
            biconomyGatewayApiId,
            biconomyTokenApiId,
            layer1Provider,
            layer2Provider,
            contract,
            supportMetaTx,
            metaTxGateway,
            account,
        )
    }
    addMargin(ammAddress: string, increaseMargin: Decimal): Promise<string> {
        return this.sendTxToFunction("addMargin", [ammAddress, increaseMargin])
    }
    removeMargin(ammAddress: string, decreaseMargin: Decimal): Promise<string> {
        return this.sendTxToFunction("removeMargin", [ammAddress, decreaseMargin])
    }
    openPosition(
        ammAddress: string,
        dir: Dir,
        quoteAssetAmount: Decimal,
        leverage: Decimal,
        minBaseAssetAmount: Decimal,
    ): Promise<string> {
        return this.sendTxToFunction("openPosition", [ammAddress, dir, quoteAssetAmount, leverage, minBaseAssetAmount])
    }
    closePosition(ammAddress: string, quoteAssetAmountLimit: Decimal): Promise<string> {
        return this.sendTxToFunction("closePosition", [ammAddress, quoteAssetAmountLimit])
    }
    adjustPosition(ammAddress: string): Promise<string> {
        return this.sendTxToFunction("adjustPosition", [ammAddress])
    }
}
