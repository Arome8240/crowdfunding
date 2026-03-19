"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import WalletConnect from "../components/WalletConnect";
import CampaignCard from "../components/CampaignCard";
import { getCampaign, getCampaignCount } from "../lib/stacks";

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
    <main>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 0",
        }}
      >
        <h1 style={{ margin: 0 }}>Stacks Crowdfunding</h1>
        <WalletConnect />
      </div>
      <Link href="/create">
        <button style={{ marginBottom: 24 }}>+ New Campaign</button>
      </Link>
      {loading ? (
        <p>Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
        <p>No campaigns yet. Create the first one.</p>
      ) : (
        campaigns.map((c) => <CampaignCard key={c.id} campaign={c} />)
      )}
    </main>
  );
}
