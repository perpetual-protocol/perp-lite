import { track, trackLink } from "./base"

interface UITrackPayload {
    path: string
    component: string
    [key: string]: string | number
}

enum EventType {
    Contract = "contract",
    UI = "ui",
}

function contractTrack(funcName: string, args: any[]) {
    track(funcName, { args, type: EventType.Contract })
}

function uiTrack(funcName: string, payload: UITrackPayload) {
    track(funcName, { ...payload, type: EventType.UI })
}

function uiTrackLink(element: HTMLElement, funcName: string, payload: UITrackPayload) {
    trackLink(element, funcName, { ...payload, type: EventType.UI })
}

// track meta transaction
export function trackSendTxToFuncRequest(funcName: string, args: any[]) {
    contractTrack(`${funcName} - Transaction Requested`, args)
}
export function trackSendTxToFuncSent(funcName: string, args: any[]) {
    contractTrack(`${funcName} - Transaction Sent`, args)
}
