"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCampaign } from "../../lib/stacks";

export default function CreateCampaign() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    goal: "",
    durationBlocks: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const deadlineOffset = parseInt(form.durationBlocks);
    const res = await fetch("https://api.hiro.so/v2/info");
    const info = await res.json();
    const deadline = info.stacks_tip_height + deadlineOffset;
    const goalMicroStx = Math.floor(parseFloat(form.goal) * 1_000_000);
    await createCampaign(form.title, form.description, goalMicroStx, deadline);
    router.push("/");
  };

  return (
    <main style={{ paddingTop: 32 }}>
      <h2>Create Campaign</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 480,
        }}
      >
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          required
        />
        <input
          type="number"
          placeholder="Goal (STX)"
          value={form.goal}
          onChange={(e) => setForm({ ...form, goal: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Duration (blocks, ~144 blocks/day)"
          value={form.durationBlocks}
          onChange={(e) => setForm({ ...form, durationBlocks: e.target.value })}
          required
        />
        <button type="submit">Create Campaign</button>
      </form>
    </main>
  );
}
