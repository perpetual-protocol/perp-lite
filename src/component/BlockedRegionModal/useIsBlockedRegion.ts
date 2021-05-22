import { useLocalStorage } from "hook/useLocalStorage"
import { useState, useEffect } from "react"
import { logger } from "lib/bugsnag/logger"
import { STORAGE_KEY } from "constant/storage"

const { IS_DEBUG_MODE } = STORAGE_KEY

export function useIsBlockedRegion() {
    const [isBlockedRegion, setIsBlockedRegion] = useState(false)
    const [isDebugMode] = useLocalStorage(IS_DEBUG_MODE.name, IS_DEBUG_MODE.defaultValue)

    useEffect(() => {
        if (isDebugMode !== "true") {
            const blockedList = process.env.REACT_APP_BLOCKED_REGION?.split(",") || []
            if (blockedList.length === 0) {
                return
            }
            try {
                fetch("https://www.cloudflare.com/cdn-cgi/trace")
                    .then(res => res.text())
                    .then(text => {
                        const ret: Record<string, string> = {}
                        text.split("\n").forEach(line => {
                            const [key, value] = line.split("=")
                            ret[key] = value
                        })
                        const isBlocked = blockedList.some(location => location === ret.loc)
                        setIsBlockedRegion(isBlocked)
                    })
            } catch (err) {
                logger.error(err)
            }
        }
    }, [isDebugMode, setIsBlockedRegion])

    return isBlockedRegion
}
