const styles = {
    global: (props: any) => ({
        ".markdown": {
            h1: {
                fontSize: "4xl",
                fontFamily: "heading",
                fontWeight: "bold",
                mb: 2,
                letterSpacing: "tight",
            },
            h2: {
                fontSize: "2xl",
                fontFamily: "heading",
                fontWeight: "bold",
                mb: 2,
                letterSpacing: "tight",
            },
            h3: {
                fontSize: "xl",
                fontFamily: "heading",
                fontWeight: "bold",
                mb: 2,
                letterSpacing: "tight",
            },
            h4: {
                fontSize: "lg",
                fontFamily: "heading",
                fontWeight: "bold",
                mb: 2,
                letterSpacing: "tight",
            },
            h5: {
                fontSize: "md",
                fontFamily: "heading",
                fontWeight: "bold",
                mb: 2,
                letterSpacing: "tight",
            },
            p: {
                fontSize: "md",
                lineHeight: "1.4",
                mb: 2,
            },
            a: {
                color: props.colorMode === "dark" ? "cyan.100" : "cyan.600",
                textDecoration: "underline",
            },
            code: {
                fontFamily: "mono",
                fontSize: "sm",
                fontWeight: "bold",
                opacity: 0.75,
            },
            li: {
                ml: "2rem",
            },
            "ol, ul": {
                mt: 4,
            },
        },
    }),
}

export default styles
