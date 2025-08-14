// app/vehicles/[id]/page.tsx
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

type Vehicle = {
  id: number;
  [k: string]: any;      // other columns (make, model, year, etc.)
  photos?: string[];
};

async function getVehicle(id: string) {
  const h = headers();
  const cookie = h.get("cookie") ?? "";
  const backend = process.env.BACKEND_URL!; // e.g., http://localhost:5000

  const res = await fetch(`${backend}/api/vehicles/${id}`, {
    headers: { cookie },          // forward browser cookie to backend
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok || !json.ok) throw new Error(json?.error?.message || `HTTP ${res.status}`);
  return json.data as { id: number; photos?: string[]; [k: string]: any };
}

export default async function Page({ params }: { params: { id: string } }) {
  const vehicle = await getVehicle(params.id);
  const photoUrl = (p: string) =>
    /^https?:\/\//i.test(p) ? p : `${process.env.BACKEND_URL}/uploads/${encodeURIComponent(p)}`;

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Veículo #{vehicle.id}</h1>
        <Link className="underline text-sm" href="/vehicles/list">← Voltar</Link>
      </div>

      {/* Basic facts (render whatever fields exist) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(vehicle)
          .filter(([k]) => !["photos"].includes(k))
          .map(([k, v]) => (
            <div key={k} className="rounded-2xl border p-4">
              <div className="text-xs uppercase text-gray-500">{k}</div>
              <div className="text-base">{String(v)}</div>
            </div>
          ))}
      </div>

      {/* Photo gallery */}
      {vehicle.photos && vehicle.photos.length > 0 ? (
        <div>
          <h2 className="text-xl font-medium mb-3">Galeria</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {vehicle.photos.map((p, i) => (
              <a
                key={i}
                href={photoUrl(p)}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden rounded-2xl border"
                title="Abrir imagem"
              >
                {/* Use unoptimized for unknown domains in dev; or configure next.config images */}
                <Image
                  src={photoUrl(p)}
                  alt={`Foto ${i + 1}`}
                  width={600}
                  height={400}
                  className="h-40 w-full object-cover"
                  unoptimized
                />
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-gray-500">Sem fotos para este veículo.</div>
      )}
    </div>
  );
}
