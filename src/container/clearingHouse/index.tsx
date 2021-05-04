import { createContainer } from "unstated-next"
import { Contract } from "../contract"
import { Connection } from "../connection"

export const ClearingHouse = createContainer(useClearingHouse)

function useClearingHouse() {
    const { ethProvider, xDaiProvider, chainId } = Connection.useContainer()
    const { clearingHouse } = Contract.useContainer()

    // TODO:
    // return methods from this hook
    // getMarginRatio()
    // maintenanceMarginRatio()
    // getOpenInterestNotionalMap()
}
