# XMTP PWA with 0xPass & Wagmi

### Installation

```bash
bun install
bun start
```

This tutorial will guide you through the process of creating an XMTP app with 0xPass & Wagmi.

https://github.com/fabriguespe/xmtp-quickstart-pwa-0xPass/blob/main/public/video.mp4

### Step 1: Setup

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

### Step 2: User Authentication

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

### Step 4: XMTP Integration

In your `Home` component, use the `useClient` hook from `@xmtp/react-sdk` to get the XMTP client.

```jsx
const { client, error, isLoading, initialize } = useClient();
```

### Step 5: Message Handling

In your `MessageContainer` component, use the `useMessages` and `useSendMessage` hooks from `@xmtp/react-sdk` to get the messages and send messages.

```jsx
const { messages, isLoading } = useMessages(conversation);
const { sendMessage } = useSendMessage();
```

### Step 6: Conversation Handling

In your ListConversations component, use the useConversations and useStreamConversations hooks from @xmtp/react-sdk to get the conversations and stream new conversations.

```jsx
const { conversations } = useConversations();
const { error } = useStreamConversations(onConversation);
```

### Step 7: Logout Handling

Finally, handle the logout process by setting the isConnected state to false, wiping the keys, and removing the signer.

```jsx
const handleLogout = async () => {
  setIsConnected(false);
  const address = await getAddress(signer);
  wipeKeys(address);
  setSigner(null);
  setIsOnNetwork(false);
  setSelectedConversation(null);
  localStorage.removeItem("isOnNetwork");
  localStorage.removeItem("isConnected");
  if (typeof onLogout === "function") {
    onLogout();
    //Calls wagmi `await disconnects()`
  }
};
```

That's it! You've now created an XMTP app with 0xPass & Wagmi.
