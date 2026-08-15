import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const SITE_URL = "https://salaryshift.vercel.app";
const DESCRIPTION =
  "See the equivalent salary you need in another country to live a similar quality of life.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "SalaryShift",
  description: DESCRIPTION,
  openGraph: {
    title: "SalaryShift",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "SalaryShift",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SalaryShift — compare your salary abroad",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SalaryShift",
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-fg font-sans">
        {children}
      </body>
    </html>
  );
}
