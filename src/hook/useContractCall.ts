import { useEffect, useCallback, useRef } from "react"
import { Contract } from "../container/contract"

export function useContractCall(fn: Function, deps: any[]) {
    const savedCallback = useRef<Function>()
    const { isInitialized } = Contract.useContainer()

    useEffect(() => {
        savedCallback.current = fn
    }, [fn])

    const memoizedCallback = useCallback(
        (...args) => {
            if (isInitialized && savedCallback.current) {
                const _fn = savedCallback.current
                return _fn(...args)
            }
        },
        // TODO: if we do `...deps` here, eslint won't help us find missing deps statically,
        // we might need to find a way to fix it
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isInitialized, ...deps],
    )

    return memoizedCallback
}
