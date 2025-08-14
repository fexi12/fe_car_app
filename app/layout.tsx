export const metadata = { title: "Car App" };
import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <div className="container">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold"><Link href="/vehicles/list">Lista de Veículos</Link></h1>
            <nav className="flex gap-3 text-sm">
              <Link className="btn-secondary" href="/vehicles/new">Adicionar</Link>
              <a className="btn-secondary" href="/">Login</a>
            
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
