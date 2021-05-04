import { getStage, Stage } from "constant"
import { Connection } from "container/connection"
import { MetaData } from "container/metadata"
import { constants } from "ethers"
import { useMemo } from "react"
import { InsuranceFundFactory } from "types/contracts/InsuranceFundFactory"
import { ClearingHouseViewerFactory } from "types/contracts/ClearingHouseViewerFactory"
import { Erc20Factory } from "types/contracts/Erc20Factory"
import { createContainer } from "unstated-next"
import { AmmFactory, AmmReaderFactory } from "types/contracts"

export const Contract = createContainer(useContract)

// TODO: Should grab contract address info from metadata config.
// production: https://metadata.perp.exchange/production.json
// staging: https://metadata.perp.exchange/staging.json
const PRODUCTION_CONTRACTS = {}
const STAGING_CONTRACTS = {}

export const CONTRACT_ADDRESS = ((stage: Stage) =>
    ({
        [Stage.Production]: PRODUCTION_CONTRACTS,
        [Stage.Staging]: STAGING_CONTRACTS,
        [Stage.Development]: STAGING_CONTRACTS,
    }[stage]))(getStage())

// NOTE: get contract address from metadata config endpoints
function getAddressFromConfig(config: any) {
    const {
        layers: {
            layer2: {
                contracts: { ClearingHouseViewer, InsuranceFund, AmmReader },
                externalContracts: { tether: XDaiTether, usdc: XDaiUsdc },
            },
        },
    } = config
    return {
        ClearingHouseViewer: ClearingHouseViewer.address,
        InsuranceFund: InsuranceFund.address,
        AmmReader: AmmReader.address,
        XDaiUsdc: XDaiUsdc || XDaiTether, // remove this part once the perp metadata config only provide one quoteAssetSymbol address
    }
}

const defaultContractInstance = {
    isInitialized: false,
    erc20: null,
    clearingHouseViewer: null,
    insuranceFund: null,
    amm: null,
    addressMap: null,
}

function useContract() {
    const { config } = MetaData.useContainer()
    const { ethProvider, xDaiProvider } = Connection.useContainer()

    return useMemo(() => {
        if (!config) {
            return defaultContractInstance
        }
        const contractAddress = getAddressFromConfig(config)
        return {
            isInitialized: true,
            erc20: {
                Eth: Erc20Factory.connect(constants.AddressZero, ethProvider),
                XDai: Erc20Factory.connect(constants.AddressZero, xDaiProvider),
            },
            clearingHouseViewer: ClearingHouseViewerFactory.connect(contractAddress.ClearingHouseViewer, xDaiProvider),
            insuranceFund: InsuranceFundFactory.connect(contractAddress.InsuranceFund, xDaiProvider),
            ammReader: AmmReaderFactory.connect(contractAddress.AmmReader, xDaiProvider),
            amm: AmmFactory.connect(constants.AddressZero, xDaiProvider),
            addressMap: contractAddress,
        }
    }, [config, ethProvider, xDaiProvider])
}
