/*
 *  1616445764 (unix timestamp secs) => return "2021/3/23"
 */
export function getDate(ts: number) {
    const date = new Date(ts * 1000)
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

/*
 * [4, 0, 0, 0] => return "4D 0H 0M 0S"
 */
export function formatTime(ts: number[]) {
    if (ts.length !== 4) {
        throw new Error("The format of timestamp is incorrect.")
    }
    return ["D", "H", "M", "S"].reduce((acc, unit, idx) => {
        return `${acc} ${ts[idx]}${unit}`
    }, "")
}

export function getDuration(t: number) {
    // secs
    if (t <= 0) {
        return [0, 0, 0, 0]
    }
    const ret = [60, 60, 24].reduce(
        (acc, unit, idx) => {
            const next = Math.floor(acc[0] / unit)
            const mod = acc[0] % unit
            const ret = [mod, ...acc.slice(1)]
            const newAcc = [next, ...ret]
            return newAcc
        },
        [t],
    )
    // add up to 4-digits array if needed
    return Array.from({ length: 4 - ret.length }, () => 0).concat(ret)
}
