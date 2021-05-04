import { FormControl, Select } from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
import { Global } from "container/global"
import React, { useCallback, useMemo } from "react"
import { Amm as AmmType } from "constant/amm"
import { Amm } from "container/amm"

function MarketSelector() {
    const { ammMap } = Amm.useContainer()
    const {
        actions: { selectAmm },
    } = Global.useContainer()

    const sortedAmmList = useMemo(() => {
        if (!ammMap) {
            return []
        }
        return Object.values(ammMap).sort((a, b) => a.baseAssetSymbol.localeCompare(b.baseAssetSymbol))
    }, [ammMap])

    const handleOnChange = useCallback(
        e => {
            const index = e.target.value
            const name = sortedAmmList[index].baseAssetSymbol
            const address = sortedAmmList[index].address
            selectAmm(name, address)
        },
        [sortedAmmList, selectAmm],
    )

    return (
        <FormControl id="market">
            <SmallFormLabel>Market</SmallFormLabel>
            <Select onChange={handleOnChange}>
                {sortedAmmList.map((amm: AmmType, index: number) => (
                    <option key={`${amm.baseAssetSymbol}-${amm.quoteAssetSymbol}`} value={index}>
                        {amm.baseAssetSymbol} / {amm.quoteAssetSymbol}
                    </option>
                ))}
            </Select>
        </FormControl>
    )
}

export default MarketSelector
