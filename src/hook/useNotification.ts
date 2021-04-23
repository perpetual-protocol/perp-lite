import { useCallback } from "react"
import { useToast } from "@chakra-ui/react"

const defaultConfig = {
    position: "bottom",
    duration: 3000,
    isClosable: true,
}

export function useNotification() {
    const toast = useToast()

    const notifySuccess = useCallback(
        payload =>
            toast({
                ...defaultConfig,
                ...payload,
                status: "success",
            }),
        [toast],
    )

    const notifyInfo = useCallback(
        payload =>
            toast({
                ...defaultConfig,
                ...payload,
                status: "info",
            }),
        [toast],
    )

    const notifyError = useCallback(
        payload =>
            toast({
                ...defaultConfig,
                ...payload,
                status: "error",
            }),
        [toast],
    )

    const closeNotify = useCallback(
        toastRef => {
            toast.close(toastRef)
        },
        [toast],
    )

    const notify = useCallback(
        payload => {
            toast({
                ...defaultConfig,
                ...payload,
            })
        },
        [toast],
    )

    return {
        notifySuccess,
        notifyInfo,
        notifyError,
        closeNotify,
        notify,
    }
}
