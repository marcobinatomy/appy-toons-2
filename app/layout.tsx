import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AppyToons2 - Disegna e Anima",
  description: "Applicazione per disegnare e animare cartoni animati",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
