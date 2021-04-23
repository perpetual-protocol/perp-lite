import { useState, useCallback } from "react"

export function useLocalStorage(key: string, initialValue: string): [string, (val: string | Function) => void] {
    const [storedValue, setStoredValue] = useState<string>(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error("localStorage get value error", error)
            return initialValue
        }
    })

    const setValue = useCallback(
        (value: string | Function) => {
            try {
                const valueToStore = value instanceof Function ? value(storedValue) : value
                setStoredValue(valueToStore)
                window.localStorage.setItem(key, JSON.stringify(valueToStore))
            } catch (error) {
                console.error("localStorage set value error", error)
            }
        },
        [key, storedValue],
    )

    return [storedValue, setValue]
}
