import type { Metadata } from "next";
import { Hepta_Slab } from "next/font/google";
import "./globals.css";

const heptaSlab = Hepta_Slab({
  variable: "--font-hepta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Control Financiero - Rafaelas",
  description: "Sistema de control de ingresos, egresos y saldos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${heptaSlab.variable} antialiased font-serif`}
      >
        {children}
      </body>
    </html>
  );
}
