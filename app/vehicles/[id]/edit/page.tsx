// app/vehicles/[id]/edit/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import EditVehicleForm from "./EditVehicleForm";

async function getVehicle(id: string) {
  const cookie = headers().get("cookie") ?? "";
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL!;
  const res = await fetch(`${backend}/api/vehicles/${id}`, {
    headers: { cookie },
    cache: "no-store",
  });

  // handle auth failures cleanly
  if (res.status === 401) {
    redirect(`/login?next=${encodeURIComponent(`/vehicles/${id}/edit`)}&msg=login-required`);
  }

  const json = await res.json();
  if (!res.ok || json?.ok === false) {
    throw new Error(json?.error?.message || `HTTP ${res.status}`);
  }
  return json.data as any;
}

export default async function Page({ params }: { params: { id: string } }) {
  const vehicle = await getVehicle(params.id);
  return <EditVehicleForm id={params.id} initial={vehicle} />;
}
