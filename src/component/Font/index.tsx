import React from "react"
import { Global } from "@emotion/react"

export const Fonts = () => (
    <Global
        styles={`
            @font-face {
                font-family: 'CamberMedium';
                font-style: normal;
                font-weight: normal;
                src: url('font/Ca1000-Md.woff') format('woff');
                text-rendering: optimizeLegibility;
            }

            @font-face {
                font-family: 'CamberBold';
                font-style: normal;
                font-weight: normal;
                src: url('font/Ca1000-Bd.woff') format('woff');
                text-rendering: optimizeLegibility;
            }
      `}
    />
)
