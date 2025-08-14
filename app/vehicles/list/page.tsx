"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
// If you don't have the @ alias configured, change to: import GalleryModal from "../../components/GalleryModal";
import GalleryModal from "@/components/GalleryModal";
import { api } from "lib/api";

type Vehicle = {
  id: number;
  marca: string;
  modelo: string;
  matricula: string;
  ano: number | null;
  photo_url?: string | null; // cover photo (absolute or filename)
};

type ApiListResp<T> = { ok: boolean; data: T; error?: { message: string } };

type VehicleDetails = {
  id: number;
  photos?: string[]; // should be absolute URLs from BE; if not, we map them
  [k: string]: any;
};

const BE_PUBLIC = process.env.BACKEND_URL!; // e.g., http://localhost:5000

// Build a browser-usable photo URL
function toPhotoURL(p?: string | null) {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p; // already absolute
  return `${BE_PUBLIC}/uploads/${encodeURIComponent(p)}`;
}

// Unwrap API response that might be `{ok,data}` or a plain array
function unwrap<T>(x: ApiListResp<T> | T): T {
  // @ts-expect-error runtime check
  return (x && typeof x === "object" && "ok" in x) ? (x as ApiListResp<T>).data : (x as T);
}

export default function Home() {
  const [data, setData] = useState<Vehicle[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Modal state
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api<ApiListResp<Vehicle[]> | Vehicle[]>("/vehicles");
        const list = unwrap(res).map(v => ({
          ...v,
          // normalize cover photo URL just in case BE sent a filename
          photo_url: v.photo_url ? toPhotoURL(v.photo_url) : null,
        }));
        setData(list);
      } catch {
        setErr("Precisas de iniciar sessão ou ocorreu um erro.");
      }
    })();
  }, []);

  // When clicking the small image, fetch full photo list and open modal
  const onOpenGallery = useCallback(async (vehicleId: number, vehicleLabel?: string) => {
    try {
      const res = await fetch(`/api/vehicles/${vehicleId}`, { credentials: "include", cache: "no-store" });
      const json = await res.json();
      if (!res.ok || (json && json.ok === false)) {
        const msg = json?.error?.message || `HTTP ${res.status}`;
        throw new Error(msg);
      }
      const details: VehicleDetails = (json?.data ?? json) as VehicleDetails;
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
  const onPrev = () => setIndex(i => (i - 1 + images.length) % images.length);
  const onNext = (delta = 1) => setIndex(i => (i + delta + images.length) % images.length);

  if (err) return <div className="card">{err}</div>;
  if (!data) return <div className="card">A carregar...</div>;

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th><th>Marca</th><th>Modelo</th><th>Matrícula</th><th>Ano</th><th>Foto</th><th>Ações</th>
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
                      style={{ height: 64, width: "auto", borderRadius: 8, objectFit: "cover", cursor: "zoom-in" }}
                      onClick={() => onOpenGallery(v.id, label)}
                      title="Abrir galeria"
                    />
                  ) : "-"}
                </td>
                <td>
                  <Link
                    href={`/vehicles/${v.id}`}
                    className="inline-block rounded-xl border px-3 py-1.5 hover:bg-gray-100"
                    title="Ver detalhes"
                  >
                    Ver detalhes →
                  </Link>
                </td>
              </tr>
            );
          })}
          {!data.length && (
            <tr><td colSpan={7} className="text-gray-500">Sem veículos.</td></tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      <GalleryModal
        open={open}
        images={images}
        index={index}
        title={title}
        onClose={onClose}
        onPrev={onPrev}
        onNext={onNext}
      />
    </div>
  );
}
