import {
    Box,
    FormControl,
    FormHelperText,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Text,
} from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Trade } from "container/trade"
import { useDebounce } from "hook/useDebounce"

function Leverage() {
    const { side, leverage, setLeverage } = Trade.useContainer()
    const [_leverage, _setLeverage] = useState<number>(1)
    const debouncedLeverage = useDebounce({ value: _leverage, delay: 500 })

    const handleOnChange = useCallback(
        (value: number) => {
            if (value !== _leverage) {
                _setLeverage(value)
            }
        },
        [_leverage],
    )

    useEffect(() => {
        if (debouncedLeverage !== leverage) {
            setLeverage(debouncedLeverage)
        }
    }, [debouncedLeverage, leverage, setLeverage])

    return useMemo(
        () => (
            <FormControl id="leverages">
                <SmallFormLabel>Leverage</SmallFormLabel>
                <Box px={10} pt={4} pb={8} bg="blackAlpha.50" borderRadius="xl">
                    <Slider
                        onChange={handleOnChange}
                        defaultValue={_leverage}
                        min={1}
                        max={10}
                        step={0.5}
                        colorScheme={side === 1 ? "green" : "red"}
                    >
                        <SliderTrack bg="gray.300">
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb
                            _focus={{ boxShadow: "2xl" }}
                            _hover={{ boxShadow: "2xl" }}
                            _highlighted={{ boxShadow: "2xl" }}
                            _grabbed={{ boxShadow: "2xl" }}
                            _pressed={{ boxShadow: "2xl" }}
                            _active={{
                                userSelect: "none",
                                pb: ["50px", 0],
                                pt: ["6px", 0],
                                height: ["88px", "36px"],
                                transform: ["translate(-50%,-70px)", "translate(-50%,-50%)"],
                                boxShadow: "md",
                            }}
                            transform={["translate(-50%,-50%)", "translate(-50%,-50%)"]}
                            h={9}
                            w={12}
                            bg={side === 1 ? "green.50" : "red.50"}
                            boxShadow="2xl"
                        >
                            <Text fontSize="sm" fontWeight="bold" color={side === 1 ? "green.600" : "red.600"}>
                                {_leverage}×
                            </Text>
                        </SliderThumb>
                    </Slider>
                </Box>
                <FormHelperText>Up to 10×</FormHelperText>
            </FormControl>
        ),
        [handleOnChange, side, _leverage],
    )
}

export default Leverage
