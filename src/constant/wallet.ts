import { AbstractConnector } from "@web3-react/abstract-connector"
import { injected, walletConnect } from "../connector"

export interface WalletInfo {
    id: string
    connector: AbstractConnector
    name: string
    iconName: string
    description: string
}

const METAMASK = {
    connector: injected,
    id: "metamask",
    name: "Metamask",
    iconName: "metamask.svg",
    description: "Easy-to-use browser extension.",
}

const WALLET_CONNECT = {
    connector: walletConnect,
    id: "walletconnect",
    name: "Wallet Connect",
    iconName: "walletconnect.svg",
    description: "universal integration via qr code",
}

export const SUPPORTED_WALLETS: WalletInfo[] = [METAMASK, WALLET_CONNECT]
