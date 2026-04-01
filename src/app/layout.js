import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/custom/sidebar";
import { MobileHeader } from "@/components/custom/mobile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

export const metadata = {
  title: "Noto.",
  description: "Organize your tasks, track progress, and stay productive every day.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col md:flex-row flex-1">
        <MobileHeader />
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
