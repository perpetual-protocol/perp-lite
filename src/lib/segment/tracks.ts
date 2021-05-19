import { track } from "./base"

// NOTE: Unused for now.
// interface UITrackPayload {
//     path: string
//     component: string
//     [key: string]: string | number
// }

enum EventType {
    Contract = "contract",
    UI = "ui",
}

function contractTrack(funcName: string, args: any[]) {
    track(funcName, { args, type: EventType.Contract })
}

// NOTE: Unused for now.
// function uiTrack(funcName: string, payload: UITrackPayload) {
//     track(funcName, { ...payload, type: EventType.UI })
// }

// NOTE: Unused for now.
// function uiTrackLink(element: HTMLElement, funcName: string, payload: UITrackPayload) {
//     trackLink(element, funcName, { ...payload, type: EventType.UI })
// }

// track meta transaction
export function trackSendTxToFuncRequest(funcName: string, args: any[]) {
    contractTrack(`${funcName} - Transaction Requested`, args)
}
export function trackSendTxToFuncSent(funcName: string, args: any[]) {
    contractTrack(`${funcName} - Transaction Sent`, args)
}
