import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "~/components/ui/sidebar";
import { SpecSidebar } from "~/app/_components/spec-sidebar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "AI Task Generator",
  description: "AI Task Generator, generate user stories and tasks for your project",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <SidebarProvider>
            <SpecSidebar />
            <SidebarInset>
              <header className="flex h-12 items-center gap-2 border-b px-4">
                <SidebarTrigger />
                <div className="ml-auto">
                  <Link href="/status">
                    <Button variant="ghost" size="sm">
                      System Status
                    </Button>
                  </Link>
                </div>
              </header>
              {children}
            </SidebarInset>
          </SidebarProvider>
          <Toaster position="bottom-right" theme="dark" richColors />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
