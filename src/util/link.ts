import { IS_MAINNET } from "../constant"

export function getEtherscanTxLink(txId: string = "") {
    const prefix = IS_MAINNET ? "" : "rinkeby."
    return `https://${prefix}etherscan.io/tx/${txId}`
}
