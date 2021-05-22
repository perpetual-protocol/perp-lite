export interface StorageDetail {
    name: string
    defaultValue: string
}

export interface StorageKey {
    [key: string]: StorageDetail
}

export const STORAGE_KEY: StorageKey = {
    ACCOUNT: {
        name: "account",
        defaultValue: "",
    },
    CONNECTOR_ID: {
        name: "connector-id",
        defaultValue: "",
    },
    LATEST_TX_DATA: {
        name: "latest-tx-data",
        defaultValue: "",
    },
    IS_DEBUG_MODE: {
        name: "is-debug-mode",
        defaultValue: "false",
    },
}
