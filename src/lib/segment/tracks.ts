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
