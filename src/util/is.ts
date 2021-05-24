export function isEmpty(obj: Object) {
    return Object.keys(obj).length === 0
}

export function isWebsocket(url: string) {
    const protocol = url.split(":")[0]
    return protocol === "wss"
}
