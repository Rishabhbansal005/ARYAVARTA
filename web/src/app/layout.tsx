import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";

export const metadata: Metadata = {
  title: "Āryāvarta — Heritage of Bharat | Indian Culture, History & Living Traditions",
  description:
    "Experience India's heritage in three dimensions. Explore 3D monuments, 2500 years of history, 83 classical ragas, real-time dance pose guidance, and India's living artisan traditions — all in one immersive digital sanctuary.",
  keywords: [
    "Indian heritage",
    "Indian culture",
    "classical dance",
    "Indian classical music",
    "ragas",
    "Indian history",
    "monuments",
    "festivals",
    "Aryavarta",
  ],
  openGraph: {
    title: "Āryāvarta — Heritage of Bharat",
    description:
      "A unified cultural world: 3D monuments, 2500-year history atlas, classical sangeet, dance pose AI, and artisan crafts.",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <LanguageProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

