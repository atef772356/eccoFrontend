"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./_component/Header";
import Footer from "./_component/Footer";
import ContextCart from "./_context/ContextCart";
import { useState } from "react";
import Head from "next/head";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout(props) {
  const { children } = props;
  const [cart, setCart] = useState();
  return (
    <ContextCart.Provider value={[cart, setCart]}>
      <ClerkProvider>
        <html lang="en">
          <Head>
            <meta name="color-scheme" content="light" />
          </Head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-amber-50 `}>
            <Header />
            {children}

            <Footer />
          </body>
        </html>
      </ClerkProvider>
    </ContextCart.Provider>
  );
}
