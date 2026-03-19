"use client";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { useState, useEffect } from "react";

const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });

export default function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const data = userSession.loadUserData();
      setAddress(data.profile.stxAddress.mainnet);
    }
  }, []);

  const connect = () =>
    showConnect({
      appDetails: { name: "Crowdfunding", icon: "/favicon.ico" },
      userSession,
      onFinish: () => {
        const data = userSession.loadUserData();
        setAddress(data.profile.stxAddress.mainnet);
      },
    });

  const disconnect = () => {
    userSession.signUserOut();
    setAddress(null);
  };

  return (
    <div>
      {address ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 13 }}>
            {address.slice(0, 8)}...{address.slice(-4)}
          </span>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
}
