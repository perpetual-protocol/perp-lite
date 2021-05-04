import { useCallback } from "react"
import { createContainer } from "unstated-next"
import { useImmerReducer } from "use-immer"

enum ACTIONS {
    TOGGLE_WALLET_MODAL = "TOGGLE_WALLET_MODAL",
}

type ActionType = {
    type: ACTIONS
    payload?: any
}

const initialState = {
    modal: {
        isWalletOpen: false,
    },
}

function reducer(state: typeof initialState, action: ActionType) {
    switch (action.type) {
        case ACTIONS.TOGGLE_WALLET_MODAL: {
            return {
                ...state,
                modal: {
                    isWalletOpen: !state.modal.isWalletOpen,
                },
            }
        }
        default:
            throw new Error()
    }
}

function useGlobal() {
    const [state, dispatch] = useImmerReducer(reducer, initialState)

    const toggleWalletModal = useCallback(() => {
        dispatch({ type: ACTIONS.TOGGLE_WALLET_MODAL })
    }, [dispatch])

    return {
        state,
        actions: {
            toggleWalletModal,
        },
    }
}

export const Global = createContainer(useGlobal)
