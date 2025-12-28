'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Map, Plus, Trash2, Truck, FileSpreadsheet } from 'lucide-react';

// 1. DEFINE O TIPO DO DADO PARA O VS CODE NÃO RECLAMAR
interface Frete {
  idString?: string;
  id?: string;
  regiao?: string | null;
  origem: string;
  destino: string;
  tipoVeiculo: string;
  valor: number;
}

export default function TabelaFretePage() {
  // 2. USA O TIPO DEFINIDO ACIMA
  const [fretes, setFretes] = useState<Frete[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fretes')
      .then(res => res.json())
      .then(data => {
        // 3. PROTEÇÃO: SÓ SALVA SE FOR UMA LISTA (ARRAY)
        if (Array.isArray(data)) {
          setFretes(data);
        } else {
          console.error("Erro na API:", data);
          setFretes([]); // Salva lista vazia para não quebrar a tela
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setFretes([]);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if(!confirm('Excluir esta rota?')) return;
    
    try {
      await fetch(`/api/fretes/${id}`, { method: 'DELETE' });
      // Remove da lista visualmente
      setFretes(prev => prev.filter(f => (f.idString || f.id) !== id));
    } catch (error) {
      alert('Erro ao excluir');
    }
  };

  // Filtro seguro (garante que string existe antes de dar lowercase)
  const fretesFiltrados = fretes.filter(f => 
    (f.origem || '').toLowerCase().includes(busca.toLowerCase()) || 
    (f.destino || '').toLowerCase().includes(busca.toLowerCase()) ||
    (f.regiao || '').toLowerCase().includes(busca.toLowerCase())
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
          <Link href="/dashboard/tabela-frete/importar">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 shadow-sm font-medium transition active:scale-95 cursor-pointer">
              <FileSpreadsheet size={20} /> Importar
            </button>
          </Link>

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
          placeholder="Pesquisar por Região, Origem ou Destino..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-gray-200 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th className="p-4">Região</th>
              <th className="p-4">Origem</th>
              <th className="p-4">Destino</th>
              <th className="p-4">Veículo</th>
              <th className="p-4 text-right">Valor</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {fretesFiltrados.map((item) => (
              // Usa uma chave única segura (idString ou id ou índice aleatório se falhar tudo)
              <tr key={item.idString || item.id || Math.random()} className="hover:bg-blue-50 transition">
                <td className="p-4">
                   <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded border border-blue-200 uppercase whitespace-nowrap">
                     {item.regiao || 'GERAL'}
                   </span>
                </td>
                <td className="p-4 font-medium">{item.origem}</td>
                <td className="p-4 font-medium">{item.destino}</td>
                <td className="p-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Truck size={14}/> {item.tipoVeiculo}
                  </span>
                </td>
                <td className="p-4 font-mono font-bold text-green-700 text-right">
                  R$ {Number(item.valor || 0).toFixed(2)}
                </td>
                <td className="p-4 text-center">
                  <div className="flex gap-2">
          
          {/* BOTÃO IMPORTAR (O Link agora é o botão) */}
          <Link 
            href="/dashboard/tabela-frete/importar"
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 shadow-sm font-medium transition active:scale-95"
          >
            <FileSpreadsheet size={20} /> Importar
          </Link>

          {/* BOTÃO NOVA ROTA (O Link agora é o botão) */}
          <Link 
            href="/dashboard/tabela-frete/novo"
            className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 shadow-sm font-medium transition active:scale-95"
          >
            <Plus size={20} /> Nova Rota
          </Link>

        </div>
                </td>
              </tr>
            ))}
            
            {fretesFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  Nenhuma rota encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}