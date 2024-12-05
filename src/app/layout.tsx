import type { Metadata } from "next";
import { DM_Sans } from "next/font/google"
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
})

export const metadata: Metadata = {
  title: "Recycle main app",
  description: "Waste management recycle web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
