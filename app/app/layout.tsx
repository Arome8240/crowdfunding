import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stacks Crowdfunding",
  description: "Decentralized crowdfunding on Stacks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0f0f13] text-white min-h-screen font-sans antialiased">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </body>
    </html>
  );
}
