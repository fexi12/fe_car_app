// app/_components/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "lib/api"; // adjust path if needed
import { StatusResponse } from "lib/types"; // adjust path if needed


export default function Header() {
  const [status, setStatus] = useState<StatusResponse | null>(null);

  useEffect(() => {
    api<StatusResponse>("/status")
      .then((res) => {
        console.log(res);
        setStatus(res)}) // extrai direto o `data`
      .catch(() => setStatus({ data: { logged_in: false, user: { id: "", role: "", username: "" } }, ok: false }));
  }, []);

  return (
    <header className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold">
        <Link href="/vehicles/list">Lista de Veículos</Link>
      </h1>
      <nav className="flex gap-3 text-sm">
        <Link className="btn-secondary" href="/vehicles/new">
          Adicionar
        </Link>

{status?.data.logged_in ? (
  <button
    className="btn-secondary"
    onClick={async () => {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
      window.location.href = "/";
    }}
  >
    Logout
  </button>
) : (
  <a className="btn-secondary" href="/">
    Login
  </a>
)}
      </nav>
    </header>
  );
}
