import React, { ReactNode } from "react"
import { Web3ReactProvider } from "@web3-react/core"
import { useInactiveListener } from "../../hook/useActiveWeb3React"
import { getLibrary } from "../../util/getLibrary"

interface ProviderProps {
    children: ReactNode | JSX.Element
}

function Web3ReactManager({ children }: ProviderProps) {
    // try to eagerly connect to an injected provider, if it exists and has granted access already
    // const triedEager = useEagerConnect()

    // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
    // useInactiveListener(!triedEager)
    useInactiveListener()

    return <>{children}</>
}

export function Web3Provider({ children }: ProviderProps) {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ReactManager>{children}</Web3ReactManager>
        </Web3ReactProvider>
    )
}
