import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { BuyMeACoffee } from "@/components/BuyMeACoffee";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SalaryShift",
  description:
    "See the equivalent salary you need in another country to live a similar quality of life.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-fg font-sans">
        {children}
        <BuyMeACoffee />
      </body>
    </html>
  );
}
