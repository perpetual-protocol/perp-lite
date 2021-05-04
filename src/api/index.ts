import { IS_MAINNET } from "../constant/stage"

// TODO: might need to update this URL
const BASE_URL = ""

export function fetchHelper(endpoint: string) {
    return window.fetch(`${BASE_URL}${endpoint}`).then(async response => {
        const data = await response.json()
        if (response.ok) {
            return data
        } else {
            return Promise.reject(data)
        }
    })
}
