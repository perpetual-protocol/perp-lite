import { Box, Button, FormHelperText, HStack } from "@chakra-ui/react"
import Big from "big.js"
import { CHAIN_ID } from "connector"
import { Connection } from "container/connection"
import { Contract } from "container/contract"
import { useToken } from "hook/useToken"
import { Trade } from "page/Home/container/trade"
import React, { useCallback } from "react"
import { formatInput, formatNumberWithPrecision } from "util/format"

function MyBalance() {
    const { account } = Connection.useContainer()
    const { collateral, setCollateral } = Trade.useContainer()
    const { addressMap } = Contract.useContainer()

    /* prepare balance data  */
    const { balance } = useToken(addressMap?.XDaiUsdc, 6, CHAIN_ID.XDai)

    const handleOnClick = useCallback(() => {
        const _collateral = new Big(collateral)
        if (balance && !_collateral.eq(balance)) {
            const formattedValue = formatInput(balance.toString(), 2)
            setCollateral(formattedValue)
        }
    }, [balance, collateral, setCollateral])

    return (
        <FormHelperText>
            <HStack w="100%" justifyContent="space-between" alignItems="flex-start">
                <Box>My Balance : {account ? formatNumberWithPrecision(balance) : "null"}</Box>
                {account && (
                    <Button borderRadius="xl" size="xs" variant="outline" onClick={handleOnClick}>
                        MAX
                    </Button>
                )}
            </HStack>
        </FormHelperText>
    )
}

export default MyBalance
