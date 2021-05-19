import { useEffect, useState } from "react"

import AmmReaderArtifact from "@perp/contract/build/contracts/src/AmmReader.sol/AmmReader.json"
import { Amm as AmmType } from "constant/amm"
import { Connection } from "container/connection"
import { Contract } from "container/contract"
import { Contract as MulticallContract } from "ethers-multicall"
import { bigNum2Big } from "util/format"
import { createContainer } from "unstated-next"
import { isAddress } from "@ethersproject/address"

export const Amm = createContainer(useAmm)

function useAmm() {
    const { insuranceFund, amm, addressMap } = Contract.useContainer()
    const { xDaiMulticallProvider } = Connection.useContainer()
    const [ammMap, setAmmMap] = useState<Record<string, AmmType> | null>(null)
    const [selectedAmm, setSelectedAmm] = useState<AmmType | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        async function getRawAmmList() {
            if (
                insuranceFund === null ||
                xDaiMulticallProvider === null ||
                amm === null ||
                addressMap === null ||
                !isAddress(addressMap.AmmReader)
            ) {
                return
            }

            /* amm address list */
            const rawAmmAddressList = await insuranceFund.getAllAmms()
            if (!rawAmmAddressList || rawAmmAddressList.length === 0) {
                return
            }

            /* get data from amm contract */
            const rawAmmContractList = rawAmmAddressList.map(
                ammAddress => new MulticallContract(ammAddress, amm.interface.fragments),
            )

            /* merge this section into the ammReaderContract section in the below, once the ammReader contract provides "open" value */
            if (rawAmmContractList.length === 0) {
                return
            }
            const ammOpenList: boolean[] = await xDaiMulticallProvider!.all(rawAmmContractList.map(amm => amm!.open()))
            const ammAddressList = rawAmmAddressList.filter((_, index) => ammOpenList[index])

            if (ammAddressList.length === 0) {
                return
            }

            /* merge this section into the ammReaderContract section in the below, once the ammReader contract provides "tollRatio" & "spreadRatio" value */
            const ammContractList = ammAddressList.map(
                ammAddress => new MulticallContract(ammAddress, amm.interface.fragments),
            )
            const ammRatioData = await xDaiMulticallProvider.all([
                ...ammContractList.map(ammContract => ammContract.tollRatio()),
                ...ammContractList.map(ammContract => ammContract.spreadRatio()),
            ])
            const tollRatioList = ammRatioData.splice(0, ammContractList.length)
            const spreadRatioList = ammRatioData.splice(0, ammContractList.length)

            /* ammReaderContract section */
            const ammReaderContract = new MulticallContract(addressMap.AmmReader, AmmReaderArtifact.abi)
            const ammRawData = await xDaiMulticallProvider.all(
                ammAddressList.map(ammAddress => ammReaderContract.getAmmStates(ammAddress)),
            )
            const _ammMap: Record<string, AmmType> = {}
            ammRawData.forEach((amm, index) => {
                /* [quoteAssetReserve, baseAssetReserve, tradeLimitRatio, fundingPeriod, quoteAssetSymbol, baseAssetSymbol, priceFeedKey, priceFeed] */
                _ammMap[amm[5]] = {
                    address: ammAddressList[index],
                    baseAssetSymbol: amm[5],
                    quoteAssetSymbol: amm[4],
                    tradeLimitRatio: bigNum2Big(amm[2]),
                    tollRatio: bigNum2Big(tollRatioList[index]),
                    spreadRatio: bigNum2Big(spreadRatioList[index]),
                }
            })

            setAmmMap(_ammMap)
            setIsLoading(false)
        }

        getRawAmmList()
    }, [addressMap, amm, insuranceFund, xDaiMulticallProvider])

    return {
        isLoading,
        ammMap,
        selectedAmm,
        setSelectedAmm,
    }
}
