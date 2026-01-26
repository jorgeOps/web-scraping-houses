import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viviendas exclusivas Barrio Salamanca",
  description: "Venta de viviendas exclusivas en el Barrio de Salamanca (Madrid)",
  openGraph: {
    title: "Viviendas exclusivas Barrio Salamanca",
    description: "Venta de viviendas exclusivas en el Barrio de Salamanca (Madrid)",
    url: "https://well-come-home.com", // Placeholder or production URL if known, good practice
    siteName: "CBS - TWCH",
    images: [
      {
        url: "/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Viviendas exclusivas Barrio Salamanca",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  icons: {
    icon: "/cbs-favicon.jpeg",
  },
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
