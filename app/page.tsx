"use client";
import { useEffect, useState } from "react";
import { api } from "/lib/api";

type Vehicle = { id:number; marca:string; modelo:string; matricula:string; ano:number|null; photo_url?:string|null; };

export default function Home() {
  const [data, setData] = useState<Vehicle[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<Vehicle[]>("/vehicles").then(setData).catch(e=>setErr("Precisas de iniciar sessão ou ocorreu um erro."));
  }, []);

  if (err) return <div className="card">{err}</div>;
  if (!data) return <div className="card">A carregar...</div>;

  return (
    <div className="card">
      <table className="table">
        <thead><tr><th>ID</th><th>Marca</th><th>Modelo</th><th>Matrícula</th><th>Ano</th><th>Foto</th></tr></thead>
        <tbody>
          {data.map(v=>(
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.marca}</td>
              <td>{v.modelo}</td>
              <td>{v.matricula}</td>
              <td>{v.ano ?? "-"}</td>
              <td>{v.photo_url ? <img src={v.photo_url} alt="" style={{height:64}}/> : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
