import { isAddress } from "@ethersproject/address"
import Big from "big.js"
import { BIG_ZERO, Dir, PnlCalcOption } from "constant"
import { Connection } from "container/connection"
import { Contract } from "container/contract"
import { useCallback, useEffect, useState } from "react"
import { decimal2Big } from "util/format"
import { Contract as MulticallContract } from "ethers-multicall"
import { big2Decimal } from "util/format"
import ClearingHouseViewerArtifact from "@perp/contract/build/contracts/src/ClearingHouseViewer.sol/ClearingHouseViewer.json"

export function useOpenedPositionSize(address: string) {
    const { addressMap, amm } = Contract.useContainer()
    const { account, xDaiMulticallProvider } = Connection.useContainer()

    const [size, setSize] = useState<Big | null>(null)
    const [margin, setMargin] = useState<Big | null>(null)
    const [unrealizedPnl, setUnrealizedPnl] = useState<Big | null>(null)
    const [outputPrice, setOutputPrice] = useState<Big | null>(null)

    const updatePositionSize = useCallback(async () => {
        if (
            xDaiMulticallProvider !== null &&
            amm !== null &&
            addressMap !== null &&
            isAddress(addressMap.ClearingHouseViewer) &&
            account !== null &&
            isAddress(address)
        ) {
            /* get { size, margin, unrealizedPnl } from clearingHouseViewerContract */
            const clearingHouseViewerContract = new MulticallContract(
                addressMap.ClearingHouseViewer,
                ClearingHouseViewerArtifact.abi,
            )
            const data = await xDaiMulticallProvider.all([
                clearingHouseViewerContract.getPersonalPositionWithFundingPayment(address, account),
                clearingHouseViewerContract.getUnrealizedPnl(address, account, PnlCalcOption.SpotPrice),
            ])

            const { size, margin } = data[0]
            const unrealizedPnl = data[1]

            const b_size = decimal2Big(size)

            let _outputPrice = null
            if (b_size.eq(0)) {
                _outputPrice = BIG_ZERO
            } else {
                const dir = b_size.gt(0) ? Dir.AddToAmm : Dir.RemoveFromAmm
                _outputPrice = decimal2Big(await amm.attach(address).getOutputPrice(dir, big2Decimal(b_size.abs())))
            }

            setSize(b_size)
            setMargin(decimal2Big(margin))
            setUnrealizedPnl(decimal2Big(unrealizedPnl))
            setOutputPrice(_outputPrice)
        }
    }, [xDaiMulticallProvider, amm, addressMap, account, address])

    useEffect(() => {
        updatePositionSize()
    }, [updatePositionSize])

    return {
        size,
        margin,
        unrealizedPnl,
        outputPrice,
    }
}
