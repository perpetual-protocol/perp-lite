import { Stage, getStage } from "../constant"

import Bugsnag from "@bugsnag/js"
import BugsnagPluginReact from "@bugsnag/plugin-react"

export function setupBugsnag() {
    Bugsnag.start({
        apiKey: process.env.REACT_APP_BUGSNAG_API_KEY || "apiKey",
        appType: "perp-lite",
        appVersion: process.env.REACT_APP_GITHUB_TAG,
        releaseStage: process.env.REACT_APP_STAGE,
        plugins: [new BugsnagPluginReact()],
    })
}

/* NOTE: LogMetadataSet: { [tabName: string]: { [propName: string]: any }} */
export type LogMetadataSet = Record<string, Record<string, any>>

export class Logger {
    private static instance: Logger | null = null
    private constructor() {}
    static init() {
        if (this.instance === null) {
            this.instance = new Logger()
        }
        return this.instance
    }
    setUser(id: string) {
        Bugsnag.setUser(id)
    }
    log(...args: any[]) {
        if (getStage() === Stage.Development) {
            console.log(...args)
        }
    }
    info(...args: any[]) {
        // info will keep messages on all env
        console.info(...args)
    }
    warn(...args: any[]) {
        if (getStage() !== Stage.Development) {
            const msg = args.join(" ")
            Bugsnag.notify({
                name: "Warn",
                message: msg,
            })
        }
        console.warn(...args)
    }
    error(err: Error, metadataSet?: LogMetadataSet) {
        if (getStage() !== Stage.Development) {
            if (!err.name) {
                err.name = "Error"
            }
            Bugsnag.notify(err, event => {
                if (metadataSet) {
                    Object.entries(metadataSet).forEach(([section, metadata]) => {
                        event.addMetadata(section, metadata)
                    })
                }
            })
        }
        console.error(err)
    }
}

export const logger = Logger.init()
