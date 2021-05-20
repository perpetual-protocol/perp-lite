import { useEffect, useState } from "react"

import { injected } from "../connector"
import { logger } from "lib/bugsnag/logger"
import { useWeb3React as useWeb3ReactCore } from "@web3-react/core"

export function useEagerConnect() {
    const { activate, active } = useWeb3ReactCore() // specifically using useWeb3ReactCore because of what this hook does
    const [tried, setTried] = useState(false)

    useEffect(() => {
        injected.isAuthorized().then(isAuthorized => {
            if (isAuthorized) {
                activate(injected, undefined, true).catch(() => {
                    setTried(true)
                })
            } else {
                setTried(true)
            }
        })
    }, [activate]) // intentionally only running on mount (make sure it's only mounted once :))

    // if the connection worked, wait until we get confirmation of that to flip the flag
    useEffect(() => {
        if (active) {
            setTried(true)
        }
    }, [active])

    return tried
}

/**
 * Used for network and injected -
 * logs user in and out after checking what network they are on.
 */
export function useInactiveListener(suppress = false) {
    const { active, error, activate } = useWeb3ReactCore() // specifically using useWeb3React because of what this hook does

    useEffect(() => {
        const { ethereum } = window

        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleConnect = () => {
                logger.info("connect...")
            }

            const handleChainChanged = () => {
                logger.info("chain changed...")
            }

            const handleAccountsChanged = (accounts: string[]) => {
                if (accounts.length > 0) {
                    logger.info("account changed...")
                }
            }

            ethereum.on("connect", handleConnect)
            ethereum.on("chainChanged", handleChainChanged)
            ethereum.on("accountsChanged", handleAccountsChanged)

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener("connect", handleConnect)
                    ethereum.removeListener("chainChanged", handleChainChanged)
                    ethereum.removeListener("accountsChanged", handleAccountsChanged)
                }
            }
        }
        return undefined
    }, [active, error, suppress, activate])
}
