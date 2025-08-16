"use client";
import { useState } from "react";

export default function NewVehicle() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string|null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/vehicles", {
        method: "POST",
        credentials: "include",
        body: fd
      });
      if (!res.ok) throw new Error(await res.text());
      window.location.href = "/vehicles/list";
    } catch (e:any) {
      setErr(e.message || "Erro ao gravar");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Novo veículo</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-3">
        <input className="input col-span-1" name="marca" placeholder="Marca" />
        <input className="input col-span-1" name="modelo" placeholder="Modelo" />
        <input className="input col-span-1" name="CC" placeholder="CC" />
        <input className="input col-span-1" name="cor" placeholder="Cor" />
        <input className="input col-span-1" name="matricula" placeholder="Matrícula" />
        <input className="input col-span-1" name="ano" placeholder="Ano" />
        <input className="input col-span-1" name="num_lugares" placeholder="Nº lugares" />
        <input className="input col-span-1" name="local_garagem" placeholder="Local garagem" />
        <input className="input col-span-2" name="estado_geral" placeholder="Estado geral" />
        <div className="col-span-2">
          <label className="block text-sm mb-1">Fotos</label>
          <input type="file" name="photos" multiple />
        </div>
        {err && <div className="text-red-600 col-span-2">{err}</div>}
        <div className="col-span-2">
          <button className="btn" disabled={busy}>{busy? "A guardar..." : "Guardar"}</button>
        </div>
      </form>
    </div>
  );
}
