import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { extractRouterConfig } from "uploadthing/server";
import "./globals.css";

import { ReactQueryProvider, ThemeProvider } from "@core/app-provider";
import { Toaster } from "@core/app-shadcn/toaster";
import { TPureLayout } from "@core/types/common.props";

import { ourFileRouter } from "./api/uploadthing/core";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s | bugbook",
    default: "bugbook",
  },
  description: "The social media app for powernerds",
};

// https://docs.uploadthing.com/getting-started/appdir#optional-uploadthing-ssr-plugin
export default function RootLayout({ children }: TPureLayout) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
