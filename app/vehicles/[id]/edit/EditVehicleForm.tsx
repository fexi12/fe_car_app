// app/vehicles/[id]/edit/EditVehicleForm.tsx
"use client";
import { useState } from "react";

export default function EditVehicleForm({ id, initial }: { id: string; initial: any }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string|null>(null);
  const [markedForDelete, setMarkedForDelete] = useState<Set<string>>(new Set());

  const toggleDelete = (name: string) =>
    setMarkedForDelete(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const fd = new FormData(e.currentTarget);
      fd.append("_method", "PUT");                  // <-- method override

      // send deletions (both styles to match BE expectation)
      for (const name of markedForDelete) {
        fd.append("delete_photos", name);
        fd.append("delete_photos[]", name);
      }

      const res = await fetch(`/api/vehicles/${id}`, {
        method: "POST",                             // <-- POST to our Next proxy
        credentials: "include",
        body: fd,
      });

      if (res.status === 401) {
        window.location.href = `/login?next=${encodeURIComponent(`/vehicles/${id}/edit`)}&msg=login-required`;
        return;
      }
      if (!res.ok) throw new Error(await res.text());
      window.location.href = `/vehicles/${id}`;
    } catch (e:any) {
      setErr(e.message || "Erro ao atualizar");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Editar veículo</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-3">
        <input className="input" name="marca" placeholder="Marca" required defaultValue={initial?.marca ?? ""} />
        <input className="input" name="modelo" placeholder="Modelo" required defaultValue={initial?.modelo ?? ""} />
        <input className="input" type="number" placeholder="CC" name="CC" defaultValue={initial?.CC ?? undefined} />
        <input className="input" name="cor"  placeholder="Cor" defaultValue={initial?.cor ?? ""} />
        <input className="input" name="matricula" placeholder="Matrícula" required defaultValue={initial?.matricula ?? ""} />
        <input className="input" type="number" placeholder="Ano" name="ano" defaultValue={initial?.ano ?? undefined} />
        <input className="input" type="number" name="num_lugares"  placeholder="Nº lugares" defaultValue={initial?.num_lugares ?? undefined} />
        <input className="input" type="local_garagem" name="local_garagem"  placeholder="Local garagem" defaultValue={initial?.local_garagem ?? undefined} />
        <input className="input col-span-2" name="N_geral" placeholder="Estado geral" defaultValue={initial?.estado_geral ?? ""} />

        {/* existing photos with delete checkboxes */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2">Fotos atuais</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(initial?.photos ?? []).map((p: string) => {
              const url = /^https?:\/\//i.test(p) ? p : `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${encodeURIComponent(p)}`;
              const checked = markedForDelete.has(p);
              return (
                <label key={p} className={`relative block rounded-xl border overflow-hidden ${checked ? "opacity-60 ring-2 ring-red-400" : ""}`} title={p}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={p} className="w-full h-32 object-cover" />
                  <div className="absolute top-2 right-2 bg-white/90 rounded-md px-2 py-1 text-xs">
                    <input type="checkbox" className="mr-1" checked={checked} onChange={() => toggleDelete(p)} />
                    Remover
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* add new photos */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Adicionar novas fotos</label>
          <input type="file" name="photos" multiple />
        </div>

        {err && <div className="text-red-600 col-span-2">{err}</div>}
        <div className="col-span-2">
          <button className="btn" disabled={busy}>{busy ? "A guardar..." : "Guardar alterações"}</button>
        </div>
      </form>
    </div>
  );
}
