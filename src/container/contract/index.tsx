import { useMemo } from "react"
import { constants } from "ethers"
import { createContainer } from "unstated-next"
import { getStage, Stage } from "../../constant"
import { MetaData } from "../metadata"
import { Erc20Factory } from "../../types/contracts/Erc20Factory"
import { Connection } from "container/connection"

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
// function getAddressFromConfig(config: any) {
//     const {
//         layers: {
//             layer1: {
//                 contracts: { StakedPerpToken, PerpStakingRewardVesting, PerpStakingRewardNoVesting },
//                 externalContracts: { perp },
//             },
//         },
//     } = config
//     return {
//         StakePerpToken: StakedPerpToken.address,
//         PerpToken: perp,
//         ImmediateVesting: PerpStakingRewardNoVesting?.address || "0x08fa612A94bBEeC0cE0aFD870132ca729848EFe8",
//         TimedVesting: PerpStakingRewardVesting.address,
//     }
// }

const defaultContractInstance = {
    isInitialized: false,
    erc20: null,
}

function useContract() {
    const { config } = MetaData.useContainer()
    const { provider } = Connection.useContainer()

    return useMemo(() => {
        if (!config) {
            return defaultContractInstance
        }
        // const contractAddress = getAddressFromConfig(config)
        return {
            isInitialized: true,
            erc20: Erc20Factory.connect(constants.AddressZero, provider),
        }
    }, [config, provider])
}
