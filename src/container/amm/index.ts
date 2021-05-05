import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { Amm as AmmType } from "constant/amm"
import { Contract } from "container/contract"
import { Contract as MulticallContract } from "ethers-multicall"
import AmmReaderArtifact from "@perp/contract/build/contracts/src/AmmReader.sol/AmmReader.json"
import { Connection } from "container/connection"

export const Amm = createContainer(useAmm)

function useAmm() {
    const { insuranceFund, amm, addressMap } = Contract.useContainer()
    const { xDaiMulticallProvider } = Connection.useContainer()
    const [ammMap, setAmmMap] = useState<Record<string, AmmType> | null>(null)
    const [selectedAmm, setSelectedAmm] = useState<AmmType | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        async function getRawAmmList() {
            /* amm address list */
            const rawAmmAddressList = await insuranceFund?.getAllAmms()
            if (!rawAmmAddressList || rawAmmAddressList.length === 0) {
                return
            }

            /* get data from amm contract */
            const ammContractList = rawAmmAddressList.map(
                ammAddress => new MulticallContract(ammAddress, amm!.interface.fragments),
            )

            /* merge this section into the ammReaderContract section in the below, once the ammReader contract provides "open" value */
            if (!ammContractList || ammContractList.length === 0) {
                return
            }
            const ammOpenList: boolean[] = await xDaiMulticallProvider!.all(ammContractList?.map(amm => amm!.open()))
            const ammAddressList = rawAmmAddressList.filter((_, index) => ammOpenList[index])

            /* ammReaderContract section */
            const ammReaderContract = new MulticallContract(addressMap!.AmmReader, AmmReaderArtifact.abi)
            if (ammReaderContract && ammReaderContract.length !== 0) {
                const ammRawData = await xDaiMulticallProvider!.all(
                    ammAddressList?.map(ammAddress => ammReaderContract.getAmmStates(ammAddress)),
                )
                const _ammMap: Record<string, AmmType> = {}
                ammRawData.forEach((amm, index) => {
                    _ammMap[amm[5]] = {
                        address: ammAddressList[index],
                        baseAssetSymbol: amm[5],
                        quoteAssetSymbol: amm[4],
                    }
                })
                setAmmMap(_ammMap)
                setIsLoading(false)
            }
        }

        if (addressMap?.AmmReader && amm && xDaiMulticallProvider && insuranceFund) {
            getRawAmmList()
        }
    }, [addressMap, amm, insuranceFund, xDaiMulticallProvider])

    return {
        isLoading,
        ammMap,
        selectedAmm,
        setSelectedAmm,
    }
}
