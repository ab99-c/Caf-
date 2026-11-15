import type { Metadata } from "next";
import "./globals.css";
import "./mvp.css";
import "./qahwati.css";

export const metadata: Metadata = {
  title: "قهوتي | Qahwati Enterprise Platform",
  description: "المنصة المغربية الموحدة لإدارة المقاهي والفوترة القانونية — الزبون، صاحب المقهى، المحاسب، والمراقبة الجبائية.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
