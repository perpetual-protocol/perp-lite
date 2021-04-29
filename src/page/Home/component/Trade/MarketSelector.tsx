import { FormControl, Select } from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
import { Global } from "container/global"
import { MetaData } from "container/metadata"
import React, { useCallback } from "react"
import { Amm } from "constant/amm"

function MarketSelector() {
    const { ammList } = MetaData.useContainer()
    const {
        actions: { selectAmm },
    } = Global.useContainer()

    const handleOnChange = useCallback(
        e => {
            const index = e.target.value
            const name = ammList[index].name
            const address = ammList[index].address
            selectAmm(name, address)
        },
        [ammList, selectAmm],
    )

    return (
        <FormControl id="market">
            <SmallFormLabel>Market</SmallFormLabel>
            <Select onChange={handleOnChange}>
                {ammList.map((amm: Amm, index: number) => (
                    <option value={index}>{amm.name} / USDC</option>
                ))}
            </Select>
        </FormControl>
    )
}

export default MarketSelector
