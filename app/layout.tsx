import type { Metadata } from "next";
import "./globals.css";
import "./mvp.css";

export const metadata: Metadata = {
  title: "قهوتي | Qahwati",
  description: "منصة طلب وإدارة خدمات المقاهي — MVP مبني بمعمارية Full-Stack.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
