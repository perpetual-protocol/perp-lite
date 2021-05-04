import { IS_MAINNET } from "constant"
import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"

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

    return {
        isLoading,
        config,
    }
}
