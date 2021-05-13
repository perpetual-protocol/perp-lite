import { useRef, useEffect } from "react"

type Callback = (...args: any[]) => void

export function useContractEvent(contract: any, eventName: string, callback: Callback) {
    const savedCallback = useRef<Callback | null>()

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback
    })

    useEffect(() => {
        function listener(...args: any[]) {
            if (savedCallback.current) {
                savedCallback.current(...args)
            }
        }
        if (contract && eventName) {
            contract.on(eventName, listener)

            return () => {
                contract.off(eventName, listener)
            }
        }
    }, [contract, eventName])
}
