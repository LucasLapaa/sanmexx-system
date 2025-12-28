'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // <--- IMPORTANTE
import { Users, Plus, Building2 } from 'lucide-react';

export default function ClientesPage() {
  const router = useRouter(); // <--- IMPORTANTE
  const [clientes, setClientes] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/clientes')
      .then(res => res.json())
      .then(data => setClientes(data));
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="text-blue-600" /> Meus Clientes
        </h1>
        
        {/* BOTÃO CORRIGIDO COM NAVEGAÇÃO VIA CLICK */}
        <button 
          onClick={() => router.push('/dashboard/clientes/novo')}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 font-medium shadow-sm transition active:scale-95"
        >
          <Plus size={20} /> Novo Cliente
        </button>

      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
            <tr>
              <th className="p-4">Empresa</th>
              <th className="p-4">CNPJ</th>
              <th className="p-4">Cidade</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-slate-50 transition">
                <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded text-blue-600">
                    <Building2 size={18} />
                  </div>
                  {cliente.nome}
                </td>
                <td className="p-4 font-mono text-sm text-slate-600">{cliente.cnpj}</td>
                <td className="p-4 text-slate-600">{cliente.cidade} - {cliente.estado}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    cliente.status === 'ATIVO' 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : 'bg-red-100 text-red-700 border-red-200'
                  }`}>
                    {cliente.status}
                  </span>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">
                  Nenhum cliente cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}