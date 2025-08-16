// app/api/vehicles/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const backend = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${backend}/api/vehicles/${params.id}`, {
    headers: { cookie: cookies().toString() },
    cache: "no-store",
  });
  const body = await res.text();
  return new NextResponse(body, { status: res.status, headers: { "content-type": res.headers.get("content-type") ?? "application/json" } });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const form = await req.formData(); // includes _method, fields, files, delete_photos
  const res = await fetch(`${backend}/api/vehicles/${params.id}`, {
    method: "POST",                                 // Flask will allow POST
    headers: {
      cookie: cookies().toString(),
      "X-HTTP-Method-Override": (form.get("_method") as string) || "PUT", // optional
    },
    body: form,                                     // keep multipart
  });
  const body = await res.text();
  return new NextResponse(body, { status: res.status, headers: { "content-type": res.headers.get("content-type") ?? "application/json" } });
}
