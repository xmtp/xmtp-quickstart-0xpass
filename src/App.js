import "0xpass/styles.css";
import Page from "./Page";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SnackbarProvider } from "notistack";

// all configs here
const connectWalletProjectId = "026ac8812e46e03ede0fa590783d1242"; //obtained from https://cloud.walletconnect.com/sign-in
const OxpassApiKey = "a4e3d96f-5469-42b0-94a2-322048c52487"; //enter your 0xpass key obtained from https://0xpass.io/register
const magicPublicKey = "pk_live_51C9905A272001A3"; //obtained from https://dashboard.magic.link/signup

export default function App({ Component, pageProps }) {
  return (
    <SnackbarProvider>
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}
      >
        <Page />
      </GoogleOAuthProvider>
    </SnackbarProvider>
  );
}
