import { tsGenerator } from "ts-generator"
import { TypeChain } from "typechain/dist/TypeChain"

async function main() {
    const cwd = process.cwd()

    await tsGenerator(
        { cwd },
        new TypeChain({
            cwd,
            rawConfig: {
                files: `${__dirname}/../node_modules/@perp/contract/build/contracts/!(build-info)/**/+([a-zA-Z0-9_]).json`,
                outDir: "src/types/contracts",
                target: "ethers-v5",
            },
        }),
    )
}

main().catch(console.error)
