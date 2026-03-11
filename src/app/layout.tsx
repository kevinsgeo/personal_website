import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
