import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "대한민국 정책24",
  description: "대한민국 소상공인, 정책자금, 정부지원금 소식을 전합니다.",
};

const ADSENSE_CLIENT = "ca-pub-2252279046795509";
const GA4_MEASUREMENT_ID = "G-4F7HSVZV56";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Google 태그 (gtag.js) - head 바로 다음. 각 페이지 1회만 */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA4_MEASUREMENT_ID}');`,
          }}
        />
        {/* 애드센스: 각 페이지 head 안에 1회 */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}