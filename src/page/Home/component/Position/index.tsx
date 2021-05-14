import { useCallback, useEffect, useState } from "react"
import { Contract as MulticallContract, ContractCall } from "ethers-multicall"
import { SimpleGrid } from "@chakra-ui/layout"
import { useInterval } from "@chakra-ui/hooks"
import { Amm } from "container/amm"
import { Connection } from "container/connection"
import { Contract } from "container/contract"
import { PnlCalcOption, PositionInfo } from "constant/position"
import { decimal2Big } from "util/format"
import PositionUnit from "./component/PositionUnit"
import ClearingHouseViewerArtifact from "@perp/contract/build/contracts/src/ClearingHouseViewer.sol/ClearingHouseViewer.json"
import { Box, Heading } from "@chakra-ui/react"

function Position() {
    const { account, xDaiMulticallProvider } = Connection.useContainer()
    const { addressMap } = Contract.useContainer()
    const { ammMap } = Amm.useContainer()
    const [positionInfo, setPositionInfo] = useState<PositionInfo[]>([])

    const getTraderPositionInfo = useCallback(async () => {
        if (addressMap !== null && addressMap.ClearingHouseViewer && ammMap && account && xDaiMulticallProvider) {
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

                /**
                 * NOTE:
                 * If the rawPositionInfo data gonna take too much bandwidth,
                 * think about slicing the one big multicall request,
                 * and change the processedPositionInfo structure below.
                 */
                const rawPositionInfo = await xDaiMulticallProvider.all([
                    /* dataGroup1: { size, margin, openNotional } = clearingHouseViewerContract.getPersonalPositionWithFundingPayment */
                    ...((sortedAmmList.map(amm =>
                        clearingHouseViewerContract.getPersonalPositionWithFundingPayment(amm.address, account),
                    ) as unknown) as ContractCall[]),
                    /* dataGroup2: { unrealizedPnl } = clearingHouseViewerContract.getUnrealizedPnl */
                    ...((sortedAmmList.map(amm =>
                        clearingHouseViewerContract.getUnrealizedPnl(amm.address, account, PnlCalcOption.SpotPrice),
                    ) as unknown) as ContractCall[]),
                ])
                const dataGroup1 = rawPositionInfo.splice(0, sortedAmmList.length)
                const dataGroup2 = rawPositionInfo.splice(0, sortedAmmList.length)

                /* add { size, margin, openNotional } info into sortedAmmList */
                const processedPositionInfo: any[] = dataGroup1.map((info: any, index: number) => ({
                    ...sortedAmmList[index],
                    size: decimal2Big(info.size),
                    margin: decimal2Big(info.margin),
                    openNotional: decimal2Big(info.openNotional),
                }))

                /* add { unrealizedPnl } info into sortedAmmList */
                processedPositionInfo.forEach((info, index) => {
                    info.unrealizedPnl = decimal2Big(dataGroup2[index])
                })

                /* filter out size zero case */
                const _positionInfo: PositionInfo[] = processedPositionInfo.filter(info => !info.size.eq(0))

                /**
                 * NOTE:
                 * Merge this section with the above xDaiMulticallProvider request,
                 * so far we separate "getMarginRatio" until the following issue is fixed
                 * https://github.com/perpetual-protocol/perp-contract/issues/475
                 */
                const marginRatioList = await xDaiMulticallProvider.all(
                    (_positionInfo.map(position =>
                        clearingHouseViewerContract.getMarginRatio(position.address, account),
                    ) as unknown) as ContractCall[],
                )
                _positionInfo.forEach((info, index) => {
                    info.marginRatio = decimal2Big(marginRatioList[index])
                })

                setPositionInfo(_positionInfo)
            } catch (err) {
                console.error("Get Trader Position Info Err:", err)
            }
        } else if (positionInfo.length !== 0) {
            setPositionInfo([])
        }
    }, [account, addressMap, ammMap, positionInfo.length, xDaiMulticallProvider])

    useEffect(() => {
        getTraderPositionInfo()
    }, [getTraderPositionInfo])

    /* update trader's position info per 5s */
    useInterval(getTraderPositionInfo, 5000)

    return (
        <SimpleGrid columns={1} spacing={8}>
            {/* if no position */}

            <Box>
                <Heading color="gray.400">No open positions.</Heading>
            </Box>

            {/* if no position */}

            {positionInfo.map((info: PositionInfo, index: number) => (
                <PositionUnit key={info.baseAssetSymbol} data={info} />
            ))}
        </SimpleGrid>
    )
}

export default Position
