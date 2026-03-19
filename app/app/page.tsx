"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import WalletConnect from "../components/WalletConnect";
import CampaignCard from "../components/CampaignCard";
import { getCampaign, getCampaignCount } from "../lib/stacks";
import { Rocket, Plus, SpinnerGap } from "@phosphor-icons/react";

export default function Home() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const count = await getCampaignCount();
      const results = await Promise.all(
        Array.from({ length: count }, (_, i) =>
          getCampaign(i + 1).then((c) => ({ id: i + 1, ...c })),
        ),
      );
      setCampaigns(results.filter(Boolean));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main className="py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <Rocket size={20} className="text-violet-400" weight="fill" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-none">
              Stacks Crowdfunding
            </h1>
            <p className="text-xs text-white/40 mt-0.5">
              Decentralized fundraising on Bitcoin
            </p>
          </div>
        </div>
        <WalletConnect />
      </div>

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-linear-to-br from-violet-900/40 via-fuchsia-900/20 to-transparent border border-white/10 p-8 mb-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent pointer-events-none" />
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 relative">
          Fund the future,
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-400">
            on-chain.
          </span>
        </h2>
        <p className="text-white/50 mb-6 max-w-md relative">
          Launch or back campaigns secured by the Bitcoin network. Transparent,
          trustless, and unstoppable.
        </p>
        <Link href="/create">
          <button className="relative flex items-center gap-2 bg-violet-600 hover:bg-violet-500 transition-colors text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-violet-900/50">
            <Plus size={18} weight="bold" />
            New Campaign
          </button>
        </Link>
      </div>

      {/* Campaigns */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
          Active Campaigns
        </h3>
        {!loading && (
          <span className="text-xs text-white/30 bg-white/5 px-2.5 py-1 rounded-full">
            {campaigns.length} total
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-white/30">
          <SpinnerGap size={28} className="animate-spin mr-3" />
          Loading campaigns…
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
          <Rocket size={40} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">No campaigns yet.</p>
          <p className="text-white/25 text-xs mt-1">
            Be the first to launch one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      )}
    </main>
  );
}
