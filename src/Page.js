import React, { useState, useCallback, useEffect } from "react";
import OTPInput from "./components/OTPInput";
import { useGoogleLogin } from "@react-oauth/google";
import { Passport } from "@0xpass/passport";
import { createPassportClient } from "@0xpass/passport-viem";
import axios from "axios";
import { mainnet } from "viem/chains";
import { http, WalletClient } from "viem";
import { enqueueSnackbar } from "notistack";
import { JsonViewer } from "@textea/json-viewer";

const alchemyUrl = process.env.NEXT_PUBLIC_ALCHEMY_URL;
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;

const Page = () => {
  const [session, setSession] = useState(null);
  const [walletClient, setWalletClient] = useState(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [oauthLoading, setOauthLoading] = useState(false);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [submitOtpLoading, setSubmitOtpLoading] = useState(false);
  const [signMessageLoading, setSignMessageLoading] = useState(false);
  const [signTxLoading, setSignTxLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [keygenTime, setKeygenTime] = useState(null);
  const [message, setMessage] = useState("");
  const [messageSignature, setMessageSignature] = useState(null);
  const [transactionSignature, setTransactionSignature] = useState(null);

  const passport = new Passport();
  const fallbackProvider = http(alchemyUrl);

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      setOauthLoading(true);
      const token = await getAccessTokenFromCode(codeResponse.code);
      const startKeygen = performance.now();
      const session = await passport.getSession({
        scope_id: "1",
        verifier_type: "google",
        code: token.toString(),
      });
      const endKeygen = performance.now();
      setKeygenTime(endKeygen - startKeygen);
      setSession(JSON.stringify(session.result));
      setOauthLoading(false);
    },
    onError: (errorResponse) => {
      console.error(errorResponse);
    },
  });

  useEffect(() => {
    async function fetchAddress() {
      const client: WalletClient = createPassportClient(
        session,
        fallbackProvider,
        mainnet
      );
      const response = await client.requestAddresses();
      setAddress(response);
    }

    if (session) {
      fetchAddress();
    }
  }, [session]);

  const handleOTPChange = useCallback((otp) => {
    setOtp(otp);
  }, []);

  return (
    <main>
      <div className="p-12">
        <h1 className="text-6xl font-bold">Passport Demo</h1>
        <p className="max-w-[40ch] leading-7 mt-8">
          Effortlessly set up your self-custody wallet with a few simple taps,
          your favorite OAuth Providers or email OTP, all while maintaining
          complete self-custody through an MPC network. Say goodbye to
          passwords, seed phrases, and private keys.{" "}
          <a
            className="italic leading-8 underline underline-offset-4"
            href="https://passport.0xpass.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more here
          </a>
        </p>
      </div>

      <div className="flex space-y-5 flex-col items-center max-w-xl mx-auto">
        {session ? (
          <div className="p-6 w-full">
            <p>Connected account: {address} </p>
            {keygenTime && (
              <p>
                Took: {keygenTime.toFixed(2)} ms - to generate key & session
              </p>
            )}
            <br />
            <br />
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow border border-1 bg-[#161618] border-gray-600 focus:outline-black rounded p-2"
              />
              <button
                className="flex-grow border border-1 rounded p-2"
                onClick={async () => {
                  setSignMessageLoading(true);
                  // Sign message logic here
                  setSignMessageLoading(false);
                }}
              >
                {signMessageLoading ? "Loading..." : "Sign Message"}
              </button>
            </div>
            {messageSignature && (
              <div className="mt-4 space-y-2 text-sm">
                <p className="break-words">
                  Signature: {messageSignature.signature}
                </p>
                <p>Time taken: {messageSignature.timeTaken.toFixed(2)} ms</p>
              </div>
            )}
            <br />
            <br />
            <div className="flex space-y-4 flex-col">
              {/* JSON Viewer for transaction details */}
              <button
                className="border border-1 rounded p-2 w-full h-12 self-center"
                onClick={async () => {
                  setSignTxLoading(true);
                  // Sign transaction logic here
                  setSignTxLoading(false);
                }}
              >
                {signTxLoading ? "Loading..." : "Sign Transaction"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-stretch space-y-8">
            <button
              onClick={googleLogin}
              className="p-2 border border-1 border-gray-600 rounded"
            >
              {oauthLoading ? "Loading..." : "Login with Google ✨"}
            </button>
            <div className="flex space-x-2">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow border border-1 bg-[#161618] border-gray-600 focus:outline-black rounded p-2"
              />
              <button
                className="flex-grow border border-1 rounded p-2"
                onClick={async () => {
                  setSendOtpLoading(true);
                  // Send OTP logic here
                  setSendOtpLoading(false);
                }}
              >
                {sendOtpLoading ? "Loading..." : "Send OTP"}
              </button>
            </div>
            <div>
              <OTPInput length={6} onChange={handleOTPChange} />
              <button
                className="w-full border border-1 rounded p-2 mt-10"
                onClick={async () => {
                  setSubmitOtpLoading(true);
                  // Submit OTP logic here
                  setSubmitOtpLoading(false);
                }}
              >
                {submitOtpLoading ? "Loading..." : "Submit OTP"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Page;

async function getAccessTokenFromCode(code) {
  const tokenUrl = "https://oauth2.googleapis.com/token";
  const data = {
    code: code,
    client_id: googleClientId,
    client_secret: googleClientSecret,
    redirect_uri: window.location.origin,
    grant_type: "authorization_code",
  };

  try {
    const response = await axios.post(tokenUrl, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching access token", error);
    throw error;
  }
}
