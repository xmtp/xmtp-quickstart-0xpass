# XMTP PWA with 0xPass & Wagmi

![xmtp](https://github.com/xmtp/xmtp-quickstart-reactjs/assets/1447073/3f2979ec-4d13-4c3d-bf20-deab3b2ffaa1)

## Installation

```bash
yarn install
yarn dev
```

## Concepts

Head to our docs to understand XMTP's concepts

- [Get started](https://xmtp.org/docs/build/get-started/overview?sdk=react)
- [Authentication](https://xmtp.org/docs/build/authentication?sdk=react)
- [Conversations](https://xmtp.org/docs/build/conversations?sdk=react)
- [Messages](https://xmtp.org/docs/build/messages/?sdk=react)
- [Streams](https://xmtp.org/docs/build/streams/?sdk=react)

#### Troubleshooting

If you get into issues with `Buffer` and `polyfills` check out the fix below:

- [Check out Buffer issue](https://github.com/xmtp/xmtp-js/issues/487)

## 0xPass

### Setup

First, you need to import the necessary libraries and components. In your index.js file, import the `WagmiConfig` from `wagmi` and wrap your main component with it.

```jsx
import "0xpass/styles.css";
import { PassProvider, connectorsForWallets, createClient } from "0xpass";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, goerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import Page from "./Page";
import {
  metaMaskWallet,
  rainbowWallet,
  emailMagicWallet,
  ledgerWallet,
} from "0xpass/wallets";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    ...(process.env.REACT_APP_ENABLE_TESTNETS === "true" ? [goerli] : []),
  ],
  [publicProvider()]
);

// all configs here
const connectWalletProjectId = ""; //obtained from https://cloud.walletconnect.com/sign-in
const OxpassApiKey = ""; //enter your 0xpass key obtained from https://0xpass.io/register
const magicPublicKey = ""; //obtained from https://dashboard.magic.link/signup

const connectors = connectorsForWallets([
  {
    groupName: "Social",
    wallets: [emailMagicWallet({ apiKey: magicPublicKey, chains })],
  },
  {
    groupName: "EOA",
    wallets: [
      metaMaskWallet({ projectId: connectWalletProjectId, chains }),
      rainbowWallet({ projectId: connectWalletProjectId, chains }),
      ledgerWallet({ projectId: connectWalletProjectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  connectors,
  publicClient,
  webSocketPublicClient,
});

const passClient = createClient({
  apiKey: OxpassApiKey,
  chains,
});

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <PassProvider client={passClient}>
        <Page />
      </PassProvider>
    </WagmiConfig>
  );
}
```

```jsx
<WagmiConfig config={wagmiConfig}>
  <InboxPage />
</WagmiConfig>
```

### User authentication

In your main component, use the `useAccount` hook to get the user's authentication status and other details.

```jsx
import { useAccount, useWalletClient } from "wagmi";
const { address, isConnecting, isDisconnected } = useAccount();

//For disconnecting
import { disconnect } from "@wagmi/core";
await disconnect();
```

### Step 3: Wallet Integration

Use the `useWalletClient` hook to get the user's wallets. Then, find the embedded wallet and set it as the signer.

```jsx
//This is the signer to send to the xmtp client
const { data: walletClient } = useWalletClient();
await initialize({ keys, options, signer /*: walletClient*/ });
```

That's it! You've now created an XMTP app with 0xPass & Wagmi.
