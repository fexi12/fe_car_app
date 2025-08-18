// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Repositório de Carros",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <div className="container">
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
