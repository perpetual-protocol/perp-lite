import { Heading, Box, Table, Tbody, Tr, Td } from "@chakra-ui/react"
import { Contract as MulticallContract } from "ethers-multicall"
import { Connection } from "container/connection"
import { Contract } from "container/contract"
import { Position } from "container/position"
import { useInterval } from "hook/useInterval"
import { useCallback, useEffect, useMemo, useState } from "react"
import ClearingHouseViewerArtifact from "@perp/contract/build/contracts/src/ClearingHouseViewer.sol/ClearingHouseViewer.json"
import { decimal2Big, numberWithCommasUsdc } from "util/format"
import { Margin } from "./container/margin"
import { MarginDir } from "constant"
import Big from "big.js"

interface MarginInfo {
    margin: Big
    marginRatio: Big
    openNotional: Big
}

function UpdatedInfo() {
    const {
        state: { address, quoteAssetSymbol },
    } = Position.useContainer()
    const { account, xDaiMulticallProvider } = Connection.useContainer()
    const { addressMap } = Contract.useContainer()
    const { marginDir: adjustMarginDir, margin: adjustMargin } = Margin.useContainer()
    const [marginInfo, setMarginInfo] = useState<MarginInfo | null>(null)

    const getMarginInfo = useCallback(async () => {
        if (account && addressMap && address && xDaiMulticallProvider) {
            /* get { margin, openNotional } from clearingHouseViewerContract */
            const clearingHouseViewerContract = new MulticallContract(
                addressMap.ClearingHouseViewer,
                ClearingHouseViewerArtifact.abi,
            )
            const rawData = await xDaiMulticallProvider.all([
                clearingHouseViewerContract.getPersonalPositionWithFundingPayment(address, account),
                clearingHouseViewerContract.getMarginRatio(address, account),
            ])
            const margin = decimal2Big(rawData[0].margin)
            const openNotional = decimal2Big(rawData[0].openNotional)
            const marginRatio = decimal2Big(rawData[1])
            const _marginInfo = {
                margin,
                marginRatio,
                openNotional,
            }
            setMarginInfo(_marginInfo)
        } else {
            setMarginInfo(null)
        }
    }, [account, address, addressMap, xDaiMulticallProvider])

    useEffect(() => {
        getMarginInfo()
    }, [getMarginInfo])

    /**
     * NOTE: higher frequency of info updating
     * update trader's position info per 2s
     */
    useInterval(getMarginInfo, 2000)

    /* prepare data for UI */
    const marginStr = useMemo(() => {
        if (adjustMargin !== null && marginInfo !== null && marginInfo.margin) {
            if (adjustMarginDir === MarginDir.Add) {
                return numberWithCommasUsdc(marginInfo.margin.add(adjustMargin))
            } else {
                return numberWithCommasUsdc(marginInfo.margin.sub(adjustMargin))
            }
        }
        return "-"
    }, [adjustMargin, adjustMarginDir, marginInfo])
    const marginRatioStr = useMemo(() => {
        if (adjustMargin !== null && marginInfo !== null && marginInfo.marginRatio && marginInfo.openNotional) {
            const { marginRatio, openNotional } = marginInfo
            if (openNotional.eq(0)) {
                return "-"
            }
            if (adjustMarginDir === MarginDir.Add) {
                return marginRatio.mul(openNotional).add(adjustMargin).div(openNotional).mul(100).toFixed(1)
            } else {
                return marginRatio.mul(openNotional).sub(adjustMargin).div(openNotional).mul(100).toFixed(1)
            }
        }
        return "-"
    }, [adjustMargin, adjustMarginDir, marginInfo])
    const leverageStr = useMemo(() => {
        if (adjustMargin !== null && marginInfo !== null && marginInfo.marginRatio && marginInfo.openNotional) {
            const { marginRatio, openNotional } = marginInfo
            if (openNotional.eq(0)) {
                return "-"
            }
            let newMarginRatio = null
            if (adjustMarginDir === MarginDir.Add) {
                newMarginRatio = marginRatio.mul(openNotional).add(adjustMargin).div(openNotional)
            } else {
                newMarginRatio = marginRatio.mul(openNotional).sub(adjustMargin).div(openNotional)
            }
            if (newMarginRatio.eq(0)) {
                return "-"
            }
            return new Big(1).div(newMarginRatio).toFixed(2)
        }
        return "-"
    }, [adjustMargin, adjustMarginDir, marginInfo])

    return (
        <>
            <Heading w="full" size="sm">
                Updated Position
            </Heading>
            <Box width="100%" borderStyle="solid" borderWidth="1px" borderColor="gray.200" borderRadius="12px">
                <Table size="sm" borderRadius="12px" overflow="hidden" w="100%" variant="simple">
                    <Tbody>
                        <Tr>
                            <Td>Margin</Td>
                            <Td isNumeric>
                                {marginStr} {quoteAssetSymbol}
                            </Td>
                        </Tr>
                        <Tr>
                            <Td>Margin Ratio</Td>
                            <Td isNumeric>{marginRatioStr} %</Td>
                        </Tr>
                        <Tr>
                            <Td>Leverage</Td>
                            <Td isNumeric>{leverageStr} x</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Box>
        </>
    )
}

export default UpdatedInfo
