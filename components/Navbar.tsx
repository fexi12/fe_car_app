// app/_components/Navbar.tsx
"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="navbar">
      <nav className="container">
        <Link href="/" className="brand">Brand</Link>
        <div className="nav-links">
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>
    </header>
  );
}
