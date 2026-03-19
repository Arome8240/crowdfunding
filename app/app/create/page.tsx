"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createCampaign } from "../../lib/stacks";
import {
  ArrowLeft,
  Rocket,
  TextT,
  AlignLeft,
  CurrencyDollar,
  Timer,
} from "@phosphor-icons/react";

export default function CreateCampaign() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    goal: "",
    durationBlocks: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Preparing transaction…");
    try {
      const deadlineOffset = parseInt(form.durationBlocks);
      const goalMicroStx = Math.floor(parseFloat(form.goal) * 1_000_000);

      if (!deadlineOffset || deadlineOffset <= 0)
        throw new Error("Duration must be a positive number of blocks.");
      if (!goalMicroStx || goalMicroStx <= 0)
        throw new Error("Goal must be a positive STX amount.");

      const res = await fetch("https://api.hiro.so/v2/info");
      if (!res.ok) throw new Error("Failed to fetch current block height.");
      const info = await res.json();
      const currentHeight = Number(info.stacks_tip_height);
      if (!currentHeight || currentHeight <= 0)
        throw new Error("Could not determine current block height.");

      const deadline = currentHeight + deadlineOffset;
      await createCampaign(
        form.title,
        form.description,
        goalMicroStx,
        deadline,
      );
      toast.success("Campaign submitted!", { id: toastId });
      router.push("/");
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      key: "title",
      label: "Campaign Title",
      placeholder: "e.g. Build a community garden",
      icon: TextT,
      type: "text",
      as: "input",
    },
    {
      key: "description",
      label: "Description",
      placeholder: "Tell people what you're building and why it matters…",
      icon: AlignLeft,
      type: "text",
      as: "textarea",
    },
    {
      key: "goal",
      label: "Funding Goal (STX)",
      placeholder: "e.g. 500",
      icon: CurrencyDollar,
      type: "number",
      as: "input",
    },
    {
      key: "durationBlocks",
      label: "Duration (blocks)",
      placeholder: "~144 blocks per day",
      icon: Timer,
      type: "number",
      as: "input",
    },
  ];

  return (
    <main className="py-10 max-w-xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to campaigns
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
          <Rocket size={20} className="text-violet-400" weight="fill" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Launch a Campaign</h1>
          <p className="text-xs text-white/40">
            Secured by the Bitcoin network
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map(({ key, label, placeholder, icon: Icon, type, as }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
              {label}
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
                <Icon size={16} />
              </div>
              {as === "textarea" ? (
                <textarea
                  placeholder={placeholder}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  rows={4}
                  required
                  className="w-full bg-white/4 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 focus:bg-white/6 transition-all resize-none"
                  style={{ paddingTop: "0.75rem" }}
                />
              ) : (
                <input
                  type={type}
                  placeholder={placeholder}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required
                  className="w-full bg-white/4 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 focus:bg-white/6 transition-all"
                />
              )}
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-violet-900/40 mt-2"
        >
          <Rocket size={18} weight="fill" />
          {loading ? "Launching…" : "Launch Campaign"}
        </button>
      </form>
    </main>
  );
}
