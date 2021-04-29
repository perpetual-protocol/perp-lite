import { Box, Button, FormHelperText, HStack } from "@chakra-ui/react"
import { CHAIN_ID } from "connector"
import { Connection } from "container/connection"
import { MetaData } from "container/metadata"
import { useToken } from "hook/useToken"
import { Trade } from "page/Home/container/trade"
import React, { useCallback } from "react"
import { formatInput, formatNumberWithPrecision } from "util/format"
import { getXDaiUsdcAddress } from "util/getUsdcAddress"

function MyBalance() {
    const { config } = MetaData.useContainer()
    const { account } = Connection.useContainer()
    const { margin, setMargin } = Trade.useContainer()

    /* prepare balance data  */
    const xDaiUsdcAddress = getXDaiUsdcAddress(config)
    const { balance } = useToken(xDaiUsdcAddress, 6, CHAIN_ID.XDai)

    const handleOnClick = useCallback(() => {
        if (!margin || margin !== balance.toString()) {
            setMargin(formatInput(balance.toString(), 2))
        }
    }, [balance, margin, setMargin])

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
