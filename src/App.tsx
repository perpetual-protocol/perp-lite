import WalletListModal from "component/WalletModal"
import * as React from "react"
import { Route, Switch } from "react-router-dom"
import Header from "./component/Header"
import Home from "./page/Home"
import "focus-visible/dist/focus-visible"

export const App = () => (
    <div style={{ background: "#E0E0E0" }}>
        <Header />
        <Switch>
            <Route path="/">
                <Home />
            </Route>
        </Switch>
        <WalletListModal />
    </div>
)
