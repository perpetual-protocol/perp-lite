import { useEffect, useMemo, useState } from "react"
import { createContainer } from "unstated-next"
import { IS_MAINNET } from "constant"
import { Amm } from "constant/amm"

export const MetaData = createContainer(useMetaData)

const configUrl = `https://metadata.perp.exchange/${IS_MAINNET ? "production" : "staging"}.json`

function useMetaData() {
    const [config, setConfig] = useState(undefined)
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        setIsLoading(true)
        fetch(configUrl)
            .then(res => res.json())
            .then(data => setConfig(data))
            .catch(e => {
                console.error(e)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    const ammList = useMemo(() => {
        if (config) {
            return getAmmList(config)
        } else {
            return []
        }
    }, [config])

    return {
        isLoading,
        config,
        ammList,
    }
}

function getAmmList(config: any): Amm[] {
    const contracts = config.layers?.layer2?.contracts
    if (!contracts || typeof contracts !== "object") {
        return []
    }
    return Object.keys(contracts)
        .filter((rawName: string) => {
            const contract = contracts[rawName]
            return contract.name === "Amm"
        })
        .sort((a, b) => a.localeCompare(b))
        .map((rawName: string) => {
            const contract = contracts[rawName]
            return {
                name: rawName.slice(0, rawName.length - 4),
                address: contract.address,
            }
        })
}
