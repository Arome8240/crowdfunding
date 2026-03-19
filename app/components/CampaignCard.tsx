"use client";
import { fundCampaign } from "../lib/stacks";

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
  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const goalStx = campaign.goal / 1_000_000;
  const raisedStx = campaign.raised / 1_000_000;

  const handleFund = async () => {
    const input = prompt("Amount in STX to contribute:");
    if (!input) return;
    const microStx = Math.floor(parseFloat(input) * 1_000_000);
    await fundCampaign(campaign.id, microStx);
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <h3>{campaign.title}</h3>
      <p style={{ color: "#555", fontSize: 14 }}>{campaign.description}</p>
      <div style={{ margin: "12px 0" }}>
        <div style={{ background: "#eee", borderRadius: 4, height: 8 }}>
          <div
            style={{
              background: "#6c47ff",
              width: `${progress}%`,
              height: 8,
              borderRadius: 4,
            }}
          />
        </div>
        <p style={{ fontSize: 13, marginTop: 4 }}>
          {raisedStx} / {goalStx} STX raised
        </p>
      </div>
      <p style={{ fontSize: 12, color: "#888" }}>
        Deadline block: {campaign.deadline}
      </p>
      {!campaign.claimed && (
        <button onClick={handleFund} style={{ marginTop: 8 }}>
          Fund this campaign
        </button>
      )}
      {campaign.claimed && (
        <span style={{ color: "green", fontSize: 13 }}>✓ Funded & claimed</span>
      )}
    </div>
  );
}
