import { extendTheme } from "@chakra-ui/react"
import config from "./config"
import colors from "./colors"
import styles from "./styles"
import fonts from "./fonts"
import components from "./components"
import radii from "./radii"

const overrides = {
    config,
    colors,
    styles,
    fonts,
    components,
    radii,
}

export default extendTheme(overrides)
