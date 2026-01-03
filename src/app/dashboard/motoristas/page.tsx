'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import Link from 'next/link';

export default function MotoristasPage() {
  const [motoristas, setMotoristas] = useState([]);

  useEffect(() => {
    // Busca da tabela de veículos, pois os dados estão lá
    fetch('/api/veiculos').then(r => r.json()).then(setMotoristas);
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Users /> Motoristas
        </h1>
        <Link href="/dashboard/veiculos">
            <button className="bg-slate-800 text-white px-4 py-2 rounded text-sm">
                Gerenciar na Frota
            </button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-4">Nome do Motorista</th>
              <th className="p-4">CPF</th>
              <th className="p-4">CNH</th>
              <th className="p-4">Veículo Vinculado</th>
              <th className="p-4">Telefone</th>
            </tr>
          </thead>
          <tbody>
            {motoristas.map((m: any) => (
              <tr key={m.id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-bold">{m.motNome}</td>
                <td className="p-4">{m.motCPF}</td>
                <td className="p-4">{m.motCNH}</td>
                <td className="p-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{m.placaCavalo}</span></td>
                <td className="p-4">{m.motTelefone}</td>
              </tr>
            ))}
            {motoristas.length === 0 && (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                        Nenhum motorista encontrado. Cadastre um Veículo para adicionar o motorista.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}