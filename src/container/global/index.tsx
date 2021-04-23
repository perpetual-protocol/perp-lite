import { useCallback } from "react"
import { createContainer } from "unstated-next"
import { useImmerReducer } from "use-immer"

enum ACTIONS {
    TOGGLE_WALLET_MODAL = "TOGGLE_WALLET_MODAL",
    SELECT_AMM = "SELECT_AMM",
}

type ActionType = {
    type: ACTIONS
    payload?: any
}

const initialState = {
    modal: {
        isWalletOpen: false,
    },
    amm: {
        name: null,
        address: null,
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
        case ACTIONS.SELECT_AMM: {
            return {
                ...state,
                amm: {
                    name: action.payload.name,
                    address: action.payload.address,
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

    const selectAmm = useCallback(
        (name: string, address: string) => {
            dispatch({
                type: ACTIONS.SELECT_AMM,
                payload: {
                    name,
                    address,
                },
            })
        },
        [dispatch],
    )

    return {
        state,
        actions: {
            toggleWalletModal,
            selectAmm,
        },
    }
}

export const Global = createContainer(useGlobal)
