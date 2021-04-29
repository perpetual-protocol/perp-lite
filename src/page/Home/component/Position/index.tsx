import { SimpleGrid } from "@chakra-ui/layout"
import ClearingHouseViewerArtifact from "@perp/contract/build/contracts/src/ClearingHouseViewer.sol/ClearingHouseViewer.json"
import { Connection } from "container/connection"
import { Contract } from "container/contract"
import { MetaData } from "container/metadata"
import { Contract as MulticallContract, ContractCall } from "ethers-multicall"
import React, { useEffect, useState } from "react"
import { decimal2Big } from "util/format"
import { getClearingHouseViewerAddress } from "util/getClearingHouseViewerAddress"
import PositionUnit from "./component/PositionUnit"

function Position() {
    const { ammList, config } = MetaData.useContainer()
    const { account, xDaiMulticallProvider } = Connection.useContainer()
    const { clearingHouseViewer } = Contract.useContainer()
    const [positionInfo, setPositionInfo] = useState<any>([])
    const clearingHouseViewerAddress = getClearingHouseViewerAddress(config)

    useEffect(() => {
        async function getTraderPositionInfo() {
            let _positionInfo
            try {
                const clearingHouseViewerContract = new MulticallContract(
                    clearingHouseViewerAddress,
                    ClearingHouseViewerArtifact.abi,
                )
                _positionInfo = await xDaiMulticallProvider!.all(
                    (ammList.map(amm =>
                        clearingHouseViewerContract!.getPersonalPositionWithFundingPayment(amm.address, account!),
                    ) as unknown) as ContractCall[],
                )
                _positionInfo = _positionInfo.map((info: any, index: number) => ({
                    ...ammList[index],
                    ...info,
                    size: decimal2Big(info.size),
                }))
                _positionInfo = _positionInfo.filter(info => !info.size.eq(0))
            } catch (err) {
                console.log("debug:", "err:", err)
            }
            setPositionInfo(_positionInfo)
        }

        if (account && clearingHouseViewer && xDaiMulticallProvider && clearingHouseViewerAddress) {
            getTraderPositionInfo()
        }
    }, [account, ammList, clearingHouseViewer, clearingHouseViewerAddress, xDaiMulticallProvider])

    return (
        <SimpleGrid columns={1} spacing={8}>
            {positionInfo.map((info: any) => (
                <PositionUnit key={info.name} data={info} />
            ))}
        </SimpleGrid>
    )
}

export default Position
