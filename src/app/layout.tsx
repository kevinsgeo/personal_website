import type { Metadata } from "next";
import localFont from "next/font/local";
import "nes.css/css/nes.min.css";
import "./globals.css";
import { IntroSeenProvider } from "@/components/IntroSeenProvider";

const minecraftia = localFont({
  src: "./fonts/Minecraftia-Regular.ttf",
});

export const metadata: Metadata = {
  title: "Kevin Shine George",
  description: "Personal website of Kevin Shine George",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={minecraftia.className}>
        <div className="crt vignette fixed inset-0" />
        <IntroSeenProvider>{children}</IntroSeenProvider>
      </body>
    </html>
  );
}
