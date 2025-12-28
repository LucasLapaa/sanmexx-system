'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link'; // <--- IMPORTANTE: Usar Link para navegação
import { Search, Map, Plus, Trash2, Truck, FileSpreadsheet } from 'lucide-react';

export default function TabelaFretePage() {
  const [fretes, setFretes] = useState<any[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fretes')
      .then(res => res.json())
      .then(data => {
        setFretes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if(!confirm('Excluir esta rota?')) return;
    await fetch(`/api/fretes/${id}`, { method: 'DELETE' });
    setFretes(fretes.filter(f => (f.idString || f.id) !== id));
  };

  const fretesFiltrados = fretes.filter(f => 
    (f.origem || '').toLowerCase().includes(busca.toLowerCase()) || 
    (f.destino || '').toLowerCase().includes(busca.toLowerCase())
  );

  if (loading) return <div className="p-8 text-gray-500">Carregando tabela...</div>;

  return (
    <div className="p-8">
      {/* CABEÇALHO */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Map className="text-blue-600" /> Tabela de Fretes
        </h1>
        
        <div className="flex gap-2">
          
          {/* BOTÃO IMPORTAR (USANDO LINK - MAIS SEGURO) */}
          <Link href="/dashboard/tabela-frete/importar">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 shadow-sm font-medium transition active:scale-95 cursor-pointer">
              <FileSpreadsheet size={20} /> Importar
            </button>
          </Link>

          {/* BOTÃO NOVA ROTA (USANDO LINK) */}
          <Link href="/dashboard/tabela-frete/novo">
            <button className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 shadow-sm font-medium transition active:scale-95 cursor-pointer">
              <Plus size={20} /> Nova Rota
            </button>
          </Link>

        </div>
      </div>

      {/* BUSCA */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="Pesquisar origem ou destino..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-gray-200 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th className="p-4">Origem</th>
              <th className="p-4">Destino</th>
              <th className="p-4">Veículo</th>
              <th className="p-4 text-right">Valor</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {fretesFiltrados.map((item) => (
              <tr key={item.idString || item.id} className="hover:bg-blue-50 transition">
                <td className="p-4 font-medium">{item.origem}</td>
                <td className="p-4 font-medium">{item.destino}</td>
                <td className="p-4 text-sm text-gray-600"><Truck size={14} className="inline mr-1"/> {item.tipoVeiculo}</td>
                <td className="p-4 font-mono font-bold text-green-700 text-right">
                  R$ {item.valor ? Number(item.valor).toFixed(2) : '0.00'}
                </td>
                <td className="p-4 text-center">
                  <button onClick={() => handleDelete(item.idString || item.id)} className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full cursor-pointer">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}