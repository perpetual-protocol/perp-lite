## Perp Lite

This is a lite version of Perpetual Protocol UI with essential features. Note that you need to manually switch to xDai network to trade.

-   👉🏻 [Official Site](https://perp.exchange)
-   👉🏻 [Official Lite Site](https://lite.perp.exchange)
-   👉🏻 [Official Staking Site](https://staking.perp.exchange)
-   👉🏻 [Discord](https://discord.com/invite/mYKKRTn)

### How to start?

-   set up `.env.local` file ([See the Environment Variables Section](#environment-variables))
-   run `yarn`
-   run `yarn generate-type`
-   run `yarn start`

### Environment Variables

check `.env.local.example`.

#### Required

```sh
REACT_APP_INFURA_API_KEY= /* infura api key */
REACT_APP_STAGE= /* "production" or "staging" */
REACT_APP_XDAI_RPC_URL= /* xDai rpc url */
```

#### Optional

```sh
REACT_APP_BUGSNAG_API_KEY= /* bugsnag api key */
REACT_APP_SEGMENT_API_KEY= /* segment api key */
```
