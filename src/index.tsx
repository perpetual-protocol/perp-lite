import * as React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { App } from "./App"
import { ChakraProvider } from "@chakra-ui/react"
import reportWebVitals from "./reportWebVitals"
import * as serviceWorker from "./serviceWorker"
import { User } from "./container/user"
import { Web3Provider } from "./container/web3"
import theme from "./theme"
import { Transaction } from "./container/transaction"
import { Contract } from "./container/contract"
import { Fonts } from "component/Font"
import { Global } from "container/global"
import { setupSegment } from "./lib/segment"
import { setupBugsnag } from "./lib/errorReport"
import { MetaData } from "./container/metadata"
import { Connection } from "./container/connection"
import { Amm } from "container/amm"

declare global {
    interface Window {
        ethereum: any
    }
}

// third party services
setupSegment()
setupBugsnag()

const Providers = ((...providers: any[]) => ({ children }: { children: React.ReactNode }) => {
    return providers.reduceRight((providers, provider) => {
        const Provider = provider.component || provider
        const props = provider.props || {}
        return <Provider {...props}>{providers}</Provider>
    }, children)
})(
    MetaData.Provider,
    { component: ChakraProvider, props: { theme } },
    Web3Provider,
    BrowserRouter,
    Global.Provider,
    User.Provider,
    Connection.Provider,
    Transaction.Provider,
    Contract.Provider,
    Amm.Provider,
)

ReactDOM.render(
    <React.StrictMode>
        <Providers>
            <Fonts />
            <App />
        </Providers>
    </React.StrictMode>,
    document.getElementById("root"),
)

// TODO:
// initialize segment

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
