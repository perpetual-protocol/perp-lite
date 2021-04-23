import { FormControl, Select } from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
import { Global } from "container/global"
import { MetaData } from "container/metadata"
import React, { useCallback, useMemo } from "react"
import { Amm } from "constant/amm"

function MarketSelector() {
    const { config } = MetaData.useContainer()
    const {
        actions: { selectAmm },
    } = Global.useContainer()

    const ammList = useMemo(() => {
        if (config) {
            return getAmmListFromConfig(config)
        } else {
            return []
        }
    }, [config])

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

function getAmmListFromConfig(config: any): Amm[] {
    const contracts = config.layers?.layer2?.contracts
    if (!contracts || typeof contracts !== "object") {
        return []
    }
    return Object.keys(contracts)
        .filter((rawName: string) => {
            const contract = contracts[rawName]
            return contract.name === "Amm"
        })
        .sort((a, b) => a.localeCompare(b))
        .map((rawName: string) => {
            const contract = contracts[rawName]
            return {
                name: rawName.slice(0, rawName.length - 4),
                address: contract.address,
            }
        })
}
