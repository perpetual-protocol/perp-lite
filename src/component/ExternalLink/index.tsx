import React, { ReactNode } from "react"

interface Props {
    href: string
    children: ReactNode
}
export function ExternalLink({ href, children }: Props) {
    return (
        <a href={href} target="_blank" rel="noreferrer noopener">
            {children}
        </a>
    )
}
