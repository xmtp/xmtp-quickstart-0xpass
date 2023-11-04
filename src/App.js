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
const connectWalletProjectId = "026ac8812e46e03ede0fa590783d1242"; //obtained from https://cloud.walletconnect.com/sign-in
const OxpassApiKey = "a4e3d96f-5469-42b0-94a2-322048c52487"; //enter your 0xpass key obtained from https://0xpass.io/register
const magicPublicKey = "pk_live_51C9905A272001A3"; //obtained from https://dashboard.magic.link/signup

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
