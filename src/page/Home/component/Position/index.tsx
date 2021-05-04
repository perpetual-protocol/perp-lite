import { SimpleGrid } from "@chakra-ui/layout"
import ClearingHouseViewerArtifact from "@perp/contract/build/contracts/src/ClearingHouseViewer.sol/ClearingHouseViewer.json"
import { Amm } from "container/amm"
import { Connection } from "container/connection"
import { Contract } from "container/contract"
import { MetaData } from "container/metadata"
import { Contract as MulticallContract, ContractCall } from "ethers-multicall"
import React, { useEffect, useState } from "react"
import { decimal2Big } from "util/format"
import { getClearingHouseViewerAddress } from "util/getClearingHouseViewerAddress"
import PositionUnit from "./component/PositionUnit"
import { PositionInfo } from "constant/position"

function Position() {
    const { config } = MetaData.useContainer()
    const { account, xDaiMulticallProvider } = Connection.useContainer()
    const { clearingHouseViewer } = Contract.useContainer()
    const { ammMap } = Amm.useContainer()
    const [positionInfo, setPositionInfo] = useState<PositionInfo[]>([])
    const clearingHouseViewerAddress = getClearingHouseViewerAddress(config)

    useEffect(() => {
        async function getTraderPositionInfo() {
            try {
                const clearingHouseViewerContract = new MulticallContract(
                    clearingHouseViewerAddress,
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

        if (ammMap && account && clearingHouseViewer && xDaiMulticallProvider && clearingHouseViewerAddress) {
            getTraderPositionInfo()
        }
    }, [account, ammMap, clearingHouseViewer, clearingHouseViewerAddress, xDaiMulticallProvider])

    return (
        <SimpleGrid columns={1} spacing={8}>
            {positionInfo.map((info: any) => (
                <PositionUnit key={info.name} data={info} />
            ))}
        </SimpleGrid>
    )
}

export default Position
