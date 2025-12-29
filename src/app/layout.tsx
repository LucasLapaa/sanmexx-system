import type { Metadata } from "next";
import { Inter } from "next/font/google";

// @ts-ignore
import "./globals.css";  

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SANMEXX OS",
  description: "Sistema Integrado de Gestão Logística",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}