import { useEffect, useState } from "react"

const DEFAULT_DELAY = 200

interface DebounceArgs<T> {
    value: T
    delay?: number
    onBeforeDebounce?: Function
    onAfterDebounce?: Function
}

export function useDebounce<T>({ value, delay = DEFAULT_DELAY, onBeforeDebounce, onAfterDebounce }: DebounceArgs<T>) {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        if (onBeforeDebounce) {
            onBeforeDebounce(value)
        }

        const handler = setTimeout(() => {
            setDebouncedValue(value)
            if (onAfterDebounce) {
                onAfterDebounce(value)
            }
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay, onBeforeDebounce, onAfterDebounce])

    return debouncedValue
}
