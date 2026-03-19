import type { Metadata } from "next";

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
      <body
        style={{
          fontFamily: "sans-serif",
          maxWidth: 800,
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        {children}
      </body>
    </html>
  );
}
