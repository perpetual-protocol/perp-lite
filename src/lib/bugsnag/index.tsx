import Bugsnag from "@bugsnag/js"
import BugsnagPluginReact from "@bugsnag/plugin-react"
import React from "react"
import { Stage } from "constant"

export function setupBugsnag() {
    Bugsnag.start({
        apiKey: process.env.REACT_APP_BUGSNAG_API_KEY || "apiKey",
        appType: "perp-lite",
        appVersion: process.env.REACT_APP_GITHUB_TAG,
        releaseStage: process.env.REACT_APP_STAGE,
        enabledReleaseStages: [Stage.Production, Stage.Staging],
        plugins: [new BugsnagPluginReact()],
    })
}

export function createErrorBoundary() {
    const plugin = Bugsnag.getPlugin("react")
    if (!plugin) {
        return ({ children }: { children: React.ReactNode }) => <>{children}</>
    }
    return plugin.createErrorBoundary(React)
}
