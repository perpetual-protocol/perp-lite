import { SimpleGrid } from "@chakra-ui/layout"
import ClearingHouseViewerArtifact from "@perp/contract/build/contracts/src/ClearingHouseViewer.sol/ClearingHouseViewer.json"
import { Amm } from "container/amm"
import { Connection } from "container/connection"
import { Contract } from "container/contract"
import { Contract as MulticallContract, ContractCall } from "ethers-multicall"
import React, { useCallback, useEffect, useState } from "react"
import { decimal2Big } from "util/format"
import PositionUnit from "./component/PositionUnit"
import { PositionInfo } from "constant/position"
import { useInterval } from "@chakra-ui/hooks"

function Position() {
    const { account, xDaiMulticallProvider } = Connection.useContainer()
    const { clearingHouseViewer, addressMap } = Contract.useContainer()
    const { ammMap } = Amm.useContainer()
    const [positionInfo, setPositionInfo] = useState<PositionInfo[]>([])

    const getTraderPositionInfo = useCallback(async () => {
        if (ammMap && account && clearingHouseViewer && xDaiMulticallProvider && addressMap?.ClearingHouseViewer) {
            try {
                /* get address list from clearing house contract */
                const clearingHouseViewerContract = new MulticallContract(
                    addressMap.ClearingHouseViewer,
                    ClearingHouseViewerArtifact.abi,
                )
                /* sort amm list by alphabetical */
                const sortedAmmList = Object.values(ammMap).sort((a, b) =>
                    a.baseAssetSymbol.localeCompare(b.baseAssetSymbol),
                )
                /* get the position info from each amm contract */
                const rawPositionInfo = await xDaiMulticallProvider.all(
                    (sortedAmmList.map(amm =>
                        clearingHouseViewerContract!.getPersonalPositionWithFundingPayment(amm.address, account),
                    ) as unknown) as ContractCall[],
                )
                /* add size info into sortedAmmList */
                const processedPositionInfo: PositionInfo[] = rawPositionInfo.map((info: any, index: number) => ({
                    ...sortedAmmList[index],
                    size: decimal2Big(info.size),
                }))
                /* filter out size zero case */
                const _positionInfo: PositionInfo[] = processedPositionInfo.filter(info => !info.size.eq(0))
                setPositionInfo(_positionInfo)
            } catch (err) {
                console.error("Get Trader Position Info Err:", err)
            }
        } else if (positionInfo.length !== 0) {
            setPositionInfo([])
        }
    }, [
        account,
        addressMap?.ClearingHouseViewer,
        ammMap,
        clearingHouseViewer,
        positionInfo.length,
        xDaiMulticallProvider,
    ])

    useEffect(() => {
        getTraderPositionInfo()
    }, [getTraderPositionInfo])

    /* update trader's position info per 5s */
    useInterval(getTraderPositionInfo, 5000)

    return (
        <SimpleGrid columns={1} spacing={8}>
            {positionInfo.map((info: PositionInfo) => (
                <PositionUnit key={info.baseAssetSymbol} data={info} />
            ))}
        </SimpleGrid>
    )
}

export default Position
