import Bugsnag from "@bugsnag/js"
import BugsnagPluginReact from "@bugsnag/plugin-react"

export function setupBugsnag() {
    Bugsnag.start({
        apiKey: process.env.REACT_APP_BUGSNAG_API_KEY || "apiKey",
        // TODO: naming this app
        appType: "dapp-boilerplate",
        appVersion: process.env.REACT_APP_GITHUB_TAG,
        releaseStage: process.env.REACT_APP_STAGE,
        plugins: [new BugsnagPluginReact()],
    })
}
