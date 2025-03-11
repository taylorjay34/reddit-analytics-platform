import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import { NavBar } from '@/components/nav-bar'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: "Reddit Analytics Platform",
  description: "Analyze and categorize Reddit posts by themes using AI",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <NavBar />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
