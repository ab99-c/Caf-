import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "قهوتي | Qahwati",
  description: "منصة رقمية لطلب وإدارة المقاهي",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}