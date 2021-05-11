import { useCallback } from "react"
import { createContainer } from "unstated-next"
import { useImmerReducer } from "use-immer"

enum ACTIONS {
    OPEN_CLOSE_POSITION_DIALOG = "OPEN_CLOSE_POSITION_DIALOG",
    CLOSE_CLOSE_POSITION_DIALOG = "CLOSE_CLOSE_POSITION_DIALOG",
}

type ActionType = {
    type: ACTIONS
    payload?: any
}

const initialState = {
    address: null,
    baseAssetSymbol: null,
    quoteAssetSymbol: null,
    isClosePositionModalOpen: false,
}

export const Position = createContainer(usePosition)

function usePosition() {
    const [state, dispatch] = useImmerReducer(reducer, initialState)

    const openClosePositionModal = useCallback(
        (address: string, baseAssetSymbol: string, quoteAssetSymbol: string) => {
            dispatch({
                type: ACTIONS.OPEN_CLOSE_POSITION_DIALOG,
                payload: {
                    address,
                    baseAssetSymbol,
                    quoteAssetSymbol,
                },
            })
        },
        [dispatch],
    )

    const closeClosePositionModal = useCallback(() => {
        dispatch({ type: ACTIONS.CLOSE_CLOSE_POSITION_DIALOG })
    }, [dispatch])

    return {
        state,
        openClosePositionModal,
        closeClosePositionModal,
    }
}

function reducer(state: typeof initialState, action: ActionType) {
    switch (action.type) {
        case ACTIONS.OPEN_CLOSE_POSITION_DIALOG: {
            return {
                ...state,
                address: action.payload.address,
                baseAssetSymbol: action.payload.baseAssetSymbol,
                quoteAssetSymbol: action.payload.quoteAssetSymbol,
                isClosePositionModalOpen: true,
            }
        }
        case ACTIONS.CLOSE_CLOSE_POSITION_DIALOG: {
            return {
                ...state,
                address: null,
                baseAssetSymbol: null,
                quoteAssetSymbol: null,
                isClosePositionModalOpen: false,
            }
        }
        default:
            throw new Error()
    }
}
