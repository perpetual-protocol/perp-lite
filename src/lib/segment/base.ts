import { Stage, STAGE } from "../../constant"

const CONFIG_VERSION = 1

export function setupSegment() {
    start(STAGE)
}

export function start(stage: Stage) {
    const analytics = getAnalytics()
    if (!analytics) return

    const writeKey = process.env.REACT_APP_SEGMENT_API_KEY
    analytics.load(writeKey)
}

export function pageView() {
    const analytics = getAnalytics()
    if (!analytics) return
    analytics.page({
        v: CONFIG_VERSION,
    })
}

export function identify(accountAddress: string) {
    const analytics = getAnalytics()
    if (!analytics) return
    analytics.identify(accountAddress)
}

export function reset() {
    const analytics = getAnalytics()
    if (!analytics) return
    analytics.reset()
}

export function track(name: string, options: Record<string, any>) {
    const analytics = getAnalytics()
    if (!analytics) return
    analytics.track(name, { ...options, v: CONFIG_VERSION })
}

export function trackLink(linkElement: HTMLElement, name: string, options: Record<string, any>) {
    const analytics = getAnalytics()
    if (!analytics) return
    analytics.trackLink(linkElement, name, { ...options, v: CONFIG_VERSION })
}

function getAnalytics() {
    return (window as any).analytics
}
