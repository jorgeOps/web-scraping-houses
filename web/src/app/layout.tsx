import type { Metadata } from "next";
import "./globals.css";

import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "Viviendas exclusivas Barrio Salamanca",
  description: "Venta de viviendas exclusivas en el Barrio de Salamanca (Madrid)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
