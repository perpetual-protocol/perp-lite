export function getShortenAccount(address: string) {
    return address.substr(0, 6) + "..." + address.substr(-4)
}
