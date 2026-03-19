"use client";
import { useState, useEffect } from "react";
import { SignOut, Lightning } from "@phosphor-icons/react/dist/ssr";

const ADDR_KEY = "stx_address";

export let connectedAddress: string | null =
  typeof window !== "undefined" ? localStorage.getItem(ADDR_KEY) : null;

export default function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(ADDR_KEY);
    if (saved) {
      setAddress(saved);
      connectedAddress = saved;
    }
  }, []);

  const connect = async () => {
    const leather = (window as any).LeatherProvider;
    if (!leather) {
      alert("Leather wallet not found. Please install it from leather.app");
      return;
    }
    const res = await leather.request("getAddresses");
    const addresses = res?.result?.addresses ?? [];
    // STX addresses start with SP (mainnet) or SM (testnet)
    const stxAddr =
      addresses.find((a: any) => a.symbol === "STX")?.address ??
      addresses.find(
        (a: any) => a.address?.startsWith("SP") || a.address?.startsWith("SM"),
      )?.address;
    if (!stxAddr) return;
    localStorage.setItem(ADDR_KEY, stxAddr);
    connectedAddress = stxAddr;
    setAddress(stxAddr);
  };

  const disconnect = () => {
    localStorage.removeItem(ADDR_KEY);
    connectedAddress = null;
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
