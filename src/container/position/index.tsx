import { useCallback } from "react"
import { createContainer } from "unstated-next"
import { useImmerReducer } from "use-immer"

enum ACTIONS {
    OPEN_CLOSE_POSITION_MODAL = "OPEN_CLOSE_POSITION_MODAL",
    CLOSE_CLOSE_POSITION_MODAL = "CLOSE_CLOSE_POSITION_MODAL",
    OPEN_ADJUST_MARGIN_MODAL = "OPEN_ADJUST_MARGIN_MODAL",
    CLOSE_ADJUST_MARGIN_MODAL = "CLOSE_ADJUST_MARGIN_MODAL",
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
    isAdjustMarginModalOpen: false,
}

export const Position = createContainer(usePosition)

function usePosition() {
    const [state, dispatch] = useImmerReducer(reducer, initialState)

    const openClosePositionModal = useCallback(
        (address: string, baseAssetSymbol: string, quoteAssetSymbol: string) => {
            dispatch({
                type: ACTIONS.OPEN_CLOSE_POSITION_MODAL,
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
        dispatch({ type: ACTIONS.CLOSE_CLOSE_POSITION_MODAL })
    }, [dispatch])

    const openAdjustMarginModal = useCallback(
        (address: string, baseAssetSymbol: string, quoteAssetSymbol: string) => {
            dispatch({
                type: ACTIONS.OPEN_ADJUST_MARGIN_MODAL,
                payload: {
                    address,
                    baseAssetSymbol,
                    quoteAssetSymbol,
                },
            })
        },
        [dispatch],
    )

    const closeAdjustMarginModal = useCallback(() => {
        dispatch({ type: ACTIONS.CLOSE_ADJUST_MARGIN_MODAL })
    }, [dispatch])

    return {
        state,
        openClosePositionModal,
        closeClosePositionModal,
        openAdjustMarginModal,
        closeAdjustMarginModal,
    }
}

function reducer(state: typeof initialState, action: ActionType) {
    switch (action.type) {
        case ACTIONS.OPEN_CLOSE_POSITION_MODAL: {
            return {
                ...state,
                address: action.payload.address,
                baseAssetSymbol: action.payload.baseAssetSymbol,
                quoteAssetSymbol: action.payload.quoteAssetSymbol,
                isClosePositionModalOpen: true,
            }
        }
        case ACTIONS.CLOSE_CLOSE_POSITION_MODAL: {
            return {
                ...state,
                address: null,
                baseAssetSymbol: null,
                quoteAssetSymbol: null,
                isClosePositionModalOpen: false,
            }
        }
        case ACTIONS.OPEN_ADJUST_MARGIN_MODAL: {
            return {
                ...state,
                address: action.payload.address,
                baseAssetSymbol: action.payload.baseAssetSymbol,
                quoteAssetSymbol: action.payload.quoteAssetSymbol,
                isAdjustMarginModalOpen: true,
            }
        }
        case ACTIONS.CLOSE_ADJUST_MARGIN_MODAL: {
            return {
                ...state,
                address: null,
                baseAssetSymbol: null,
                quoteAssetSymbol: null,
                isAdjustMarginModalOpen: false,
            }
        }
        default:
            throw new Error()
    }
}
