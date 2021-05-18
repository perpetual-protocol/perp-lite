import { Link, LinkProps } from "@chakra-ui/react"

import { ReactNode } from "react"

interface Props extends LinkProps {
    href: string
    children: ReactNode
}
export function ExternalLink({ href, children, ...props }: Props) {
    return (
        <Link href={href} target="_blank" rel="noreferrer noopener" {...props}>
            {children}
        </Link>
    )
}
