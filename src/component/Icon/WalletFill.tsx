import { Icon } from "@chakra-ui/react"
import React from "react"

const WalletFill = (props: any) => {
    return (
        <Icon width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M18 3C19.103 3 20 3.897 20 5V7C21.103 7 22 7.897 22 9V19C22 20.103 21.103 21 20 21H5C3.794 21 2 20.201 2 18V6C2 4.346 3.346 3 5 3H18ZM18 5H5C4.448 5 4 5.449 4 6C4 6.551 4.448 7 5 7H18V5ZM14 17H16V15H18V13H16V11H14V13H12V15H14V17Z"
                fill="currentColor"
            />
        </Icon>
    )
}

export default WalletFill
