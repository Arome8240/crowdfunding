"use client";
import { fundCampaign } from "../lib/stacks";
import { useState } from "react";
import {
  CurrencyDollar,
  Timer,
  CheckCircle,
  ArrowRight,
  User,
} from "@phosphor-icons/react";

interface Campaign {
  id: number;
  title: string;
  description: string;
  goal: number;
  raised: number;
  deadline: number;
  claimed: boolean;
  creator: string;
}

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [amount, setAmount] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const goalStx = (campaign.goal / 1_000_000).toLocaleString();
  const raisedStx = (campaign.raised / 1_000_000).toLocaleString();
  const isComplete = campaign.claimed || progress >= 100;

  const handleFund = async () => {
    if (!amount) return;
    setLoading(true);
    const microStx = Math.floor(parseFloat(amount) * 1_000_000);
    await fundCampaign(campaign.id, microStx);
    setLoading(false);
    setShowInput(false);
    setAmount("");
  };

  return (
    <div className="group bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-violet-500/40 hover:bg-white/[0.05] transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-lg font-semibold text-white leading-snug">
          {campaign.title}
        </h3>
        {isComplete && (
          <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full shrink-0">
            <CheckCircle size={13} weight="fill" />
            Funded
          </span>
        )}
      </div>

      <p className="text-sm text-white/50 mb-5 leading-relaxed line-clamp-2">
        {campaign.description}
      </p>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-white/40 mb-1.5">
          <span className="flex items-center gap-1">
            <CurrencyDollar size={13} />
            {raisedStx} STX raised
          </span>
          <span>Goal: {goalStx} STX</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-right text-xs text-violet-400 mt-1">
          {progress.toFixed(1)}%
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-white/30 mb-5">
        <span className="flex items-center gap-1">
          <Timer size={13} />
          Block {campaign.deadline}
        </span>
        <span className="flex items-center gap-1">
          <User size={13} />
          {campaign.creator.slice(0, 8)}…{campaign.creator.slice(-4)}
        </span>
      </div>

      {/* Fund action */}
      {!isComplete && (
        <div>
          {showInput ? (
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Amount in STX"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/60"
              />
              <button
                onClick={handleFund}
                disabled={loading || !amount}
                className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
              >
                {loading ? (
                  "..."
                ) : (
                  <>
                    <ArrowRight size={15} weight="bold" /> Fund
                  </>
                )}
              </button>
              <button
                onClick={() => setShowInput(false)}
                className="text-white/30 hover:text-white/60 text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="w-full flex items-center justify-center gap-2 border border-violet-500/30 hover:border-violet-500 hover:bg-violet-500/10 text-violet-400 hover:text-violet-300 text-sm font-medium py-2.5 rounded-xl transition-all duration-200"
            >
              <CurrencyDollar size={16} />
              Fund this campaign
            </button>
          )}
        </div>
      )}
    </div>
  );
}
