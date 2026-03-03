import type { Metadata } from "next";
import { AuthProvider } from "@/lib/useAuth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Architect",
  description: "Design AI Agent architectures as finite state machines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
