import { Web3Provider } from "@ethersproject/providers"
import { IS_MAINNET } from "../constant/stage"
import { InjectedConnector } from "@web3-react/injected-connector"
import { NetworkConnector } from "@web3-react/network-connector"
import { providers } from "ethers"
import { isWebsocket } from "util/is"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
// import { WalletLinkConnector } from '@web3-react/walletlink-connector'
// import { LedgerConnector } from '@web3-react/ledger-connector'
// import { TrezorConnector } from '@web3-react/trezor-connector'
// import { LatticeConnector } from '@web3-react/lattice-connector'
// import { FrameConnector } from '@web3-react/frame-connector'
// import { AuthereumConnector } from '@web3-react/authereum-connector'
// import { FortmaticConnector } from '@web3-react/fortmatic-connector'
// import { MagicConnector } from '@web3-react/magic-connector'
// import { PortisConnector } from '@web3-react/portis-connector'
// import { TorusConnector } from '@web3-react/torus-connector'

export enum CHAIN_ID {
    Ethereum = 1,
    Rinkeby = 4,
    XDai = 100,
}

const { REACT_APP_MAINNET_RPC_URL, REACT_APP_RINKEBY_RPC_URL, REACT_APP_XDAI_RPC_URL } = process.env

const RPC_URLS = {
    [CHAIN_ID.Ethereum]: REACT_APP_MAINNET_RPC_URL!,
    [CHAIN_ID.Rinkeby]: REACT_APP_RINKEBY_RPC_URL!,
    [CHAIN_ID.XDai]: REACT_APP_XDAI_RPC_URL!,
}

export const network = new NetworkConnector({
    urls: RPC_URLS,
    defaultChainId: IS_MAINNET ? CHAIN_ID.Ethereum : CHAIN_ID.Rinkeby,
})

export function getNetworkLibrary(): Web3Provider {
    const chainId = IS_MAINNET ? CHAIN_ID.Ethereum : CHAIN_ID.Rinkeby
    const rpcUrl = RPC_URLS[chainId]!
    if (isWebsocket(rpcUrl)) {
        return (new providers.WebSocketProvider(rpcUrl, chainId) as unknown) as Web3Provider
    } else {
        return (new providers.JsonRpcProvider(rpcUrl, chainId) as unknown) as Web3Provider
    }
}

export function getXDaiNetworkLibrary(): Web3Provider {
    const rpcUrl = RPC_URLS[CHAIN_ID.XDai]
    if (isWebsocket(rpcUrl)) {
        return (new providers.WebSocketProvider(rpcUrl, CHAIN_ID.XDai) as unknown) as Web3Provider
    } else {
        return (new providers.JsonRpcProvider(rpcUrl, CHAIN_ID.XDai) as unknown) as Web3Provider
    }
}

// see all chain ids in https://chainid.network/
export const injected = new InjectedConnector({
    supportedChainIds: [CHAIN_ID.Ethereum, CHAIN_ID.Rinkeby, CHAIN_ID.XDai],
})

export const walletConnect = new WalletConnectConnector({
    rpc: IS_MAINNET
        ? {
              [CHAIN_ID.Ethereum]: RPC_URLS[CHAIN_ID.Ethereum],
          }
        : { [CHAIN_ID.Rinkeby]: RPC_URLS[CHAIN_ID.Rinkeby] },
    pollingInterval: 15000,
})

export class LedgerProvider {}
