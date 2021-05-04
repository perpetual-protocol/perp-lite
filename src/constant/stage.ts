export enum Stage {
    Production = "production",
    Staging = "staging",
    Development = "development",
}

export const STAGE = getStage()

export function getStage(): Stage {
    if (process.env.REACT_APP_STAGE === "production") {
        return Stage.Production
    } else if (process.env.REACT_APP_STAGE === "staging") {
        return Stage.Staging
    } else {
        // we connect to staging environment by default
        return Stage.Staging
    }
}

export const IS_MAINNET = getStage() === Stage.Production
