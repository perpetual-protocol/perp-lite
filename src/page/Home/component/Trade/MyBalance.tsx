import { Box, Button, FormHelperText, HStack } from "@chakra-ui/react"
import Big from "big.js"
import { CHAIN_ID } from "connector"
import { USDC_DECIMAL_DIGITS } from "constant"
import { Connection } from "container/connection"
import { Contract } from "container/contract"
import { useToken } from "hook/useToken"
import { Trade } from "page/Home/container/trade"
import React, { useCallback } from "react"
import { numberWithCommasUsdc } from "util/format"

function MyBalance() {
    const { account } = Connection.useContainer()
    const { setCollateral } = Trade.useContainer()
    const { addressMap } = Contract.useContainer()

    /* prepare balance data  */
    const { balance } = useToken(addressMap ? addressMap.XDaiUsdc : "", USDC_DECIMAL_DIGITS, CHAIN_ID.XDai)

    const handleOnClick = useCallback(() => {
        /* make sure the precision will be controlled */
        const fixedBalance = balance.toFixed(2)
        const b_fixedBalance = new Big(fixedBalance)
        if (!b_fixedBalance.eq(0)) {
            setCollateral(b_fixedBalance)
        }
    }, [balance, setCollateral])

    return (
        <FormHelperText>
            <HStack w="100%" justifyContent="space-between" alignItems="flex-start">
                <Box>My Balance : {account ? numberWithCommasUsdc(balance) : "null"}</Box>
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
