import WalletListModal from "component/WalletModal"
import { Route, Switch } from "react-router-dom"
import Header from "./component/Header"
import Home from "./page/Home"
import "focus-visible/dist/focus-visible"
import { Container, Divider } from "@chakra-ui/react"
import ClosePositionModal from "component/ClosePositionModal"

export const App = () => (
    <Container maxW="container.md" pb={20} px={6}>
        <Header />
        <Divider />
        <Switch>
            <Route path="/">
                <Home />
            </Route>
        </Switch>
        <WalletListModal />
        <ClosePositionModal />
    </Container>
)
