import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inmobiliaria Madrid",
  description: "Venta y alquiler de pisos en Madrid",
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
      </body>
    </html>
  );
}
