"use client";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { useState, useEffect } from "react";
import { Wallet, SignOut, Lightning } from "@phosphor-icons/react";

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

  if (address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-white/80 font-mono">
            {address.slice(0, 8)}…{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="flex items-center gap-1.5 text-sm text-white/50 hover:text-red-400 transition-colors px-3 py-2 rounded-xl hover:bg-red-400/10"
        >
          <SignOut size={16} />
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 transition-colors text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-violet-900/40"
    >
      <Lightning size={18} weight="fill" />
      Connect Wallet
    </button>
  );
}
