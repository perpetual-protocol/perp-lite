import { useState, useEffect } from "react"
import { createContainer } from "unstated-next"
import { useWeb3React } from "@web3-react/core"
import { Provider as MulticallProvider } from "ethers-multicall"
import { getNetworkLibrary, getXDaiNetworkLibrary } from "connector"

export const Connection = createContainer(useConnection)

const ethReadOnlyProvider = getNetworkLibrary()
const xDaiReadOnlyProvider = getXDaiNetworkLibrary()

function useConnection() {
    const { account, library, active, chainId } = useWeb3React()
    const [ethMulticallProvider, setMulticallProvider] = useState<MulticallProvider | null>(null)
    const [xDaiMulticallProvider, setXDaiMulticallProvider] = useState<MulticallProvider | null>(null)

    // create read only multicall provider
    useEffect(() => {
        const _ethMulticallProvider = new MulticallProvider(ethReadOnlyProvider)
        const _xDaiMulticallProvider = new MulticallProvider(xDaiReadOnlyProvider)

        Promise.all([_ethMulticallProvider.init(), _xDaiMulticallProvider.init()]).then(() => {
            setMulticallProvider(_ethMulticallProvider)
            setXDaiMulticallProvider(_xDaiMulticallProvider)
        })
    }, [])

    return {
        ethMulticallProvider,
        xDaiMulticallProvider,
        ethProvider: ethReadOnlyProvider,
        xDaiProvider: xDaiReadOnlyProvider,
        signer: library?.getSigner() || null,
        active,
        account: account || null,
        chainId,
    }
}
