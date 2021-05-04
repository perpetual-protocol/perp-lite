import { SimpleGrid } from "@chakra-ui/layout"
import ClearingHouseViewerArtifact from "@perp/contract/build/contracts/src/ClearingHouseViewer.sol/ClearingHouseViewer.json"
import { Amm } from "container/amm"
import { Connection } from "container/connection"
import { Contract } from "container/contract"
import { Contract as MulticallContract, ContractCall } from "ethers-multicall"
import React, { useEffect, useState } from "react"
import { decimal2Big } from "util/format"
import PositionUnit from "./component/PositionUnit"
import { PositionInfo } from "constant/position"

function Position() {
    const { account, xDaiMulticallProvider } = Connection.useContainer()
    const { clearingHouseViewer, addressMap } = Contract.useContainer()
    const { ammMap } = Amm.useContainer()
    const [positionInfo, setPositionInfo] = useState<PositionInfo[]>([])

    useEffect(() => {
        async function getTraderPositionInfo() {
            try {
                const clearingHouseViewerContract = new MulticallContract(
                    addressMap!.ClearingHouseViewer,
                    ClearingHouseViewerArtifact.abi,
                )
                const sortedAmmList = Object.values(ammMap!).sort((a, b) =>
                    a.baseAssetSymbol.localeCompare(b.baseAssetSymbol),
                )
                const rawPositionInfo = await xDaiMulticallProvider!.all(
                    (sortedAmmList.map(amm =>
                        clearingHouseViewerContract!.getPersonalPositionWithFundingPayment(amm.address, account!),
                    ) as unknown) as ContractCall[],
                )
                const processedPositionInfo: PositionInfo[] = rawPositionInfo.map((info: any, index: number) => ({
                    ...sortedAmmList[index],
                    size: decimal2Big(info.size),
                }))
                const _positionInfo: PositionInfo[] = processedPositionInfo.filter(info => !info.size.eq(0))
                setPositionInfo(_positionInfo)
            } catch (err) {
                console.log("debug:", "err:", err)
            }
        }

        if (ammMap && account && clearingHouseViewer && xDaiMulticallProvider && addressMap?.ClearingHouseViewer) {
            getTraderPositionInfo()
        }
    }, [account, addressMap, ammMap, clearingHouseViewer, xDaiMulticallProvider])

    return (
        <SimpleGrid columns={1} spacing={8}>
            {positionInfo.map((info: PositionInfo) => (
                <PositionUnit key={info.baseAssetSymbol} data={info} />
            ))}
        </SimpleGrid>
    )
}

export default Position
