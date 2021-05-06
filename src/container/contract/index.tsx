import { getStage, Stage } from "constant/stage"
import { Connection } from "container/connection"
import { MetaData } from "container/metadata"
import { constants } from "ethers"
import { useMemo } from "react"
import {
    ClearingHouseViewer__factory as ClearingHouseViewerFactory,
    ERC20__factory as Erc20Factory,
    Amm__factory as AmmFactory,
    AmmReader__factory as AmmReaderFactory,
    ClearingHouse__factory as ClearingHouseFactory,
    InsuranceFund__factory as InsuranceFundFactory,
    MetaTxGateway__factory as MetaTxGatewayFactory,
} from "types/contracts"
import { createContainer } from "unstated-next"
import { Amm } from "types/contracts/Amm"

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

interface AddressMap {
    ClearingHouseViewer: string
    InsuranceFund: string
    AmmReader: string
    ClearingHouse: string
    XDaiUsdc: string
    MetaTxGateway: string
}

// NOTE: get contract address from metadata config endpoints
function getAddressFromConfig(config: any): AddressMap {
    const {
        layers: {
            layer2: {
                contracts: { ClearingHouseViewer, ClearingHouse, InsuranceFund, AmmReader, MetaTxGateway },
                externalContracts: { tether: XDaiTether, usdc: XDaiUsdc },
            },
        },
    } = config
    return {
        ClearingHouseViewer: ClearingHouseViewer.address,
        InsuranceFund: InsuranceFund.address,
        AmmReader: AmmReader.address,
        ClearingHouse: ClearingHouse.address,
        XDaiUsdc: XDaiUsdc || XDaiTether, // remove this part once the perp metadata config only provide one quoteAssetSymbol address
        MetaTxGateway: MetaTxGateway.address,
    }
}

const defaultContractInstance = {
    isInitialized: false,
    erc20: null,
    clearingHouseViewer: null,
    clearingHouse: null,
    insuranceFund: null,
    metaTxGateway: null,
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
            insuranceFund: InsuranceFundFactory.connect(contractAddress.InsuranceFund, xDaiProvider),
            ammReader: AmmReaderFactory.connect(contractAddress.AmmReader, xDaiProvider),
            amm: AmmFactory.connect(constants.AddressZero, xDaiProvider) as Amm,
            addressMap: contractAddress,
            clearingHouseViewer: ClearingHouseViewerFactory.connect(contractAddress.ClearingHouseViewer, xDaiProvider),
            clearingHouse: ClearingHouseFactory.connect(contractAddress.ClearingHouse, xDaiProvider),
            metaTxGateway: MetaTxGatewayFactory.connect(contractAddress.MetaTxGateway, xDaiProvider),
        }
    }, [config, ethProvider, xDaiProvider])
}
