import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <--- ESTA LINHA É A MÁGICA QUE TRAZ O ESTILO DE VOLTA

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sanmexx - Sistema Logístico",
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