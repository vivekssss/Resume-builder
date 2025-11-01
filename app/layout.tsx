import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ToastProvider } from "@/components/ui/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Resume Builder - Cloud Saved",
  description: "Create professional resumes with AI assistance and cloud storage. Sign in with Google to save your work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ToastProvider />
          {children}
        </Providers>
      </body>
    </html>
  );
}
