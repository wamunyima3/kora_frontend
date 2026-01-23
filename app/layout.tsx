import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import StoreProvider from "./StoreProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { Toaster } from "sonner";
import "./globals.css";
import ReactQueryProvider from "./ReactQueryProvider";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kora Service Portal",
  description: "Manage your services and configurations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <StoreProvider>
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </StoreProvider>
          </SidebarProvider>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
