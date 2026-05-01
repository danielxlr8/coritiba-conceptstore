import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/lib/gsap";
import "./globals.css";
import { AppProviders } from "@/components/app/AppProviders";

const saira = localFont({
  src: "./fonts/Saira-Latin-Variable.woff2",
  variable: "--font-saira",
  weight: "100 900",
  display: "swap",
});

const sairaCondensed = localFont({
  src: [
    {
      path: "./fonts/SairaCondensed-400-Latin.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/SairaCondensed-500-Latin.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/SairaCondensed-600-Latin.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/SairaCondensed-700-Latin.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/SairaCondensed-800-Latin.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/SairaCondensed-900-Latin.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-saira-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Coxa Store | E-commerce Premium",
  description: "A paixao do torcedor no e-commerce mais moderno.",
  icons: {
    icon: [
      {
        url: "/imagens/favicon.png",
        type: "image/png",
      },
    ],
    shortcut: "/imagens/favicon.png",
    apple: "/imagens/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${saira.variable} ${sairaCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

