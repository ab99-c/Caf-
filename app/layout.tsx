import type { Metadata } from "next";
import "./globals.css";
import "./enterprise.css";

export const metadata: Metadata = {
  title: "قهوتي | Qahwati Enterprise Platform",
  description: "منصة SaaS لإدارة وطلب خدمات المقاهي — مبنية للتوسع والأمان.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}