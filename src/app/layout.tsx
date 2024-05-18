import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@mantine/core/styles.css';
import { ColorSchemeScript } from '@mantine/core';

const inter = Inter({ subsets: ["latin"] });
  
export const metadata: Metadata = {
  title: "Student-info Form",
  description: "Student-info",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
