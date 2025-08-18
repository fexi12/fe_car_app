"use client";
import { useState } from "react";

export default function LoginPage() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const res = await fetch("/api/login", {
                method: "POST",
                credentials: "include",             // keep this
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
              });
      if (!res.ok) throw new Error(await res.text());
      window.location.href = "/vehicles/list";
    } catch (e: any) {
      setErr(e.message || "Erro de login");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto card">
      <h2 className="text-xl mb-4 font-semibold">Entrar</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input" placeholder="Utilizador" value={username} onChange={e=>setU(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setP(e.target.value)} required />
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <button className="btn" disabled={busy}>{busy? "A entrar..." : "Entrar"}</button>
      </form>
    </div>
  );
}
