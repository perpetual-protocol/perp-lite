import { useState, useEffect } from "react"
import { createContainer } from "unstated-next"
import { useWeb3React } from "@web3-react/core"
import { Provider as MulticallProvider } from "ethers-multicall"
import { getNetworkLibrary } from "connector"

export const Connection = createContainer(useConnection)

const readOnlyProvider = getNetworkLibrary()

function useConnection() {
    const { account, library, active } = useWeb3React()
    const [multicallProvider, setMulticallProvider] = useState<MulticallProvider | null>(null)

    useEffect(() => {
        if (library) {
            const ethMulticallProvider = new MulticallProvider(library)
            ethMulticallProvider.init().then(() => setMulticallProvider(ethMulticallProvider))
        }
    }, [library])

    return {
        multicallProvider,
        provider: library || readOnlyProvider,
        signer: library?.getSigner() || null,
        active,
        account,
    }
}
