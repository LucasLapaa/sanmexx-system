'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Plus, Search } from 'lucide-react';

export default function ContratosListaPage() {
  const [contratos, setContratos] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/contratos')
      .then(res => res.json())
      .then(data => setContratos(data));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVO': return 'bg-green-100 text-green-800 border-green-200';
      case 'AGUARDANDO': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELADO': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="text-blue-600" /> Gestão de Contratos
        </h1>
        <Link href="/dashboard/contratos/novo">
          <button className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800">
            <Plus size={20} /> Novo Contrato
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
            <tr>
              <th className="p-4">Nº Contrato</th>
              <th className="p-4">Motorista</th>
              <th className="p-4">Origem / Destino</th>
              <th className="p-4">Status</th>
              <th className="p-4">Data</th>
              <th className="p-4 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contratos.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition">
                <td className="p-4 font-bold text-blue-900">#{c.numero}</td>
                <td className="p-4">{c.motoristaNome}</td>
                <td className="p-4 text-sm text-slate-500">{c.origem} ➔ {c.destino}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(c.status)}`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-500">
                  {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4 text-right font-mono font-medium">
                  R$ {c.valorTotal.toFixed(2)}
                </td>
              </tr>
            ))}
            {contratos.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  Nenhum contrato encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}