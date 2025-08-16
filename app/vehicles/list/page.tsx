"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import GalleryModal from "@/components/GalleryModal";
import { api } from "lib/api";

type Vehicle = {
  id: number;
  marca: string;
  modelo: string;
  matricula: string;
  ano: number | null;
  photo_url?: string | null;
};

type ApiListResp<T> = { ok: boolean; data: T; total?: number; page?: number; per_page?: number; error?: { message: string } };

const BE_PUBLIC = process.env.NEXT_PUBLIC_BACKEND_URL;

function toPhotoURL(p?: string | null) {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  return `${BE_PUBLIC}/uploads/${encodeURIComponent(p)}`;
}

export default function Home() {
  // table data
  const [data, setData] = useState<Vehicle[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  // controls
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sort, setSort] = useState<"id" | "marca" | "modelo" | "matricula" | "ano">("id");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  // gallery modal
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [title, setTitle] = useState<string>("");

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / perPage)), [total, perPage]);

  // fetch list whenever controls change
  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        setData(null);
        const params = new URLSearchParams({
          page: String(page),
          per_page: String(perPage),
          sort,
          order,
        });
        if (q.trim()) params.set("q", q.trim());

        // use your Next API proxy (recommended) or hit BE directly if you forward cookies
        const res = await api<ApiListResp<Vehicle[]>>(`/vehicles?${params.toString()}`);
        const json = res as ApiListResp<Vehicle[]>;

        if (!json.ok) throw new Error(json.error?.message || "Erro ao carregar");
        const list = (json.data || []).map(v => ({
          ...v,
          photo_url: v.photo_url ? toPhotoURL(v.photo_url) : null,
        }));
        setData(list);
        setTotal(json.total ?? list.length);
      } catch (e: any) {
        setErr(e.message || "Precisas de iniciar sessão ou ocorreu um erro.");
      }
    })();
  }, [q, page, perPage, sort, order]);

  // sorting by clicking header
  const toggleSort = (col: typeof sort) => {
    if (sort === col) {
      setOrder(o => (o === "asc" ? "desc" : "asc"));
    } else {
      setSort(col);
      setOrder("asc");
    }
    setPage(1);
  };

  // thumbnails modal helpers
  const onOpenGallery = useCallback(async (vehicleId: number, vehicleLabel?: string) => {
    try {
      const res = await fetch(`/api/vehicles/${vehicleId}`, { credentials: "include", cache: "no-store" });
      const json = await res.json();
      if (!res.ok || (json && json.ok === false)) {
        const msg = json?.error?.message || `HTTP ${res.status}`;
        throw new Error(msg);
      }
      const details = (json?.data ?? json) as { photos?: string[] };
      const gallery = (details.photos ?? []).map(toPhotoURL);
      if (!gallery.length) throw new Error("Sem fotos para este veículo.");
      setImages(gallery);
      setIndex(0);
      setTitle(vehicleLabel || `Veículo #${vehicleId}`);
      setOpen(true);
    } catch (e: any) {
      setErr(e.message || "Erro ao abrir galeria");
    }
  }, []);

  const onClose = () => setOpen(false);
  const onPrev = () => setIndex(i => (images.length ? (i - 1 + images.length) % images.length : 0));
  const onNext = (delta = 1) => setIndex(i => (images.length ? (i + delta + images.length) % images.length : 0));

  // UI
  return (
    <div className="card space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="flex gap-2 items-center">
          <input
            className="input"
            placeholder="Pesquisar (marca, modelo, matrícula)"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
          />
          <select
            className="input"
            value={perPage}
            onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
            title="Itens por página"
          >
            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}/pág.</option>)}
          </select>
        </div>

        <div className="text-sm text-gray-600">
          {err ? "—" : `${total} veículo${total === 1 ? "" : "s"}`}
        </div>
      </div>

      {err && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>}

      {!data ? (
        <div className="card">A carregar…</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table min-w-[800px]">
            <thead>
              <tr>
                {[
                  ["id", "ID"],
                  ["marca", "Marca"],
                  ["modelo", "Modelo"],
                  ["matricula", "Matrícula"],
                  ["ano", "Ano"],
                  ["foto", "Foto"],
                  ["acoes", "Ações"],
                ].map(([key, label]) => (
                  key !== "foto" && key !== "acoes" ? (
                    <th key={key} className="cursor-pointer select-none" onClick={() => toggleSort(key as any)}>
                      {label}
                      {sort === key && (order === "asc" ? " ▲" : " ▼")}
                    </th>
                  ) : (
                    <th key={key}>{label}</th>
                  )
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(v => {
                const cover = v.photo_url || null;
                const label = `${v.marca} ${v.modelo}`;
                return (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.marca}</td>
                    <td>{v.modelo}</td>
                    <td>{v.matricula}</td>
                    <td>{v.ano ?? "-"}</td>
                    <td>
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cover}
                          alt={`Foto do veículo ${label}`}
                          style={{ height: 48, width: "auto", borderRadius: 6, objectFit: "cover", cursor: "zoom-in" }}
                          onClick={() => onOpenGallery(v.id, label)}
                          title="Abrir galeria"
                        />
                      ) : "-"}
                    </td>
                    <td className="whitespace-nowrap">
                      <Link href={`/vehicles/${v.id}`} className="inline-block rounded-xl border px-3 py-1.5 hover:bg-gray-100">Ver</Link>
                      {" "}
                      <Link href={`/vehicles/${v.id}/edit`} className="inline-block rounded-xl border px-3 py-1.5 hover:bg-gray-100">Editar</Link>
                    </td>
                  </tr>
                );
              })}
              {!data.length && (
                <tr><td colSpan={7} className="text-gray-500">Sem veículos.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <button
          className="btn"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          ⟵ Anterior
        </button>
        <div className="text-sm text-gray-600">
          Página {page} de {totalPages}
        </div>
        <button
          className="btn"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
        >
          Seguinte ⟶
        </button>
      </div>

      {/* Modal */}
      <GalleryModal
        open={open}
        images={images}
        index={index}
        title={title}
        onClose={() => setOpen(false)}
        onPrev={onPrev}
        onNext={onNext}
      />
    </div>
  );
}
