import { Stage, getStage } from "../../constant"

import Bugsnag from "@bugsnag/js"

/* NOTE: LogMetadataSet: { [tabName: string]: { [propName: string]: any }} */
export type LogMetadataSet = Record<string, Record<string, any>>

class Logger {
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
        // NOTE: info will keep messages on all env
        console.info(...args)
    }
    warn(...args: any[]) {
        const msg = args.join(" ")
        // NOTE: only send in enabled env configured in Bugsnag.start's `enabledReleaseStages` prop.
        Bugsnag.notify({
            name: "Warn",
            message: msg,
        })
        console.warn(...args)
    }
    error(err: Error, metadataSet?: LogMetadataSet) {
        // NOTE: only send in enabled env configured in Bugsnag.start's `enabledReleaseStages` prop.
        Bugsnag.notify(err, event => {
            if (metadataSet) {
                Object.entries(metadataSet).forEach(([section, metadata]) => {
                    event.addMetadata(section, metadata)
                })
            }
        })
        console.error(err)
    }
}

export const logger = Logger.init()
