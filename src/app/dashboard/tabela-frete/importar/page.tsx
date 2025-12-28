'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Map, Plus, Trash2, Truck, FileSpreadsheet } from 'lucide-react';

export default function TabelaFretePage() {
  const router = useRouter();
  const [fretes, setFretes] = useState<any[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  // Busca os dados ao carregar
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

  // Função de Excluir
  const handleDelete = async (id: string) => {
    if(!confirm('Tem certeza que deseja excluir esta rota?')) return;
    
    // Tenta excluir usando o ID correto (note que no banco pode ser idString ou id, ajustamos aqui)
    await fetch(`/api/fretes/${id}`, { method: 'DELETE' });
    
    // Atualiza a lista visualmente
    setFretes(fretes.filter(f => f.idString !== id && f.id !== id));
  };

  // Filtro de Busca (Origem ou Destino)
  const fretesFiltrados = fretes.filter(f => 
    (f.origem?.toLowerCase() || '').includes(busca.toLowerCase()) || 
    (f.destino?.toLowerCase() || '').includes(busca.toLowerCase())
  );

  if (loading) return <div className="p-8 text-gray-500">Carregando tabela de fretes...</div>;

  return (
    <div className="p-8">
      {/* CABEÇALHO E BOTÕES */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Map className="text-blue-600" /> Tabela de Fretes
        </h1>
        
        <div className="flex gap-2">
          {/* Botão Importar (Novo) */}
          <button 
            onClick={() => router.push('/dashboard/tabela-frete/importar')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 shadow-sm transition active:scale-95 font-medium"
            title="Copiar e Colar do Excel"
          >
            <FileSpreadsheet size={20} /> Importar
          </button>

          {/* Botão Nova Rota Manual */}
          <button 
            onClick={() => router.push('/dashboard/tabela-frete/novo')}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 shadow-sm transition active:scale-95 font-medium"
          >
            <Plus size={20} /> Nova Rota
          </button>
        </div>
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-blue-100 transition"
          placeholder="Pesquisar cidade de origem ou destino..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </div>

      {/* TABELA DE DADOS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="p-4">Origem</th>
              <th className="p-4">Destino</th>
              <th className="p-4">Veículo</th>
              <th className="p-4 text-right">Valor Base</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {fretesFiltrados.map((item) => (
              <tr key={item.idString || item.id} className="hover:bg-blue-50 transition group">
                <td className="p-4 font-medium text-gray-700">{item.origem}</td>
                <td className="p-4 font-medium text-gray-700">{item.destino}</td>
                <td className="p-4">
                  <span className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded w-fit border border-gray-200">
                    <Truck size={14} /> {item.tipoVeiculo}
                  </span>
                </td>
                <td className="p-4 font-mono font-bold text-green-700 text-right">
                  R$ {item.valor ? Number(item.valor).toFixed(2) : '0.00'}
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => handleDelete(item.idString || item.id)}
                    className="text-gray-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-full"
                    title="Excluir Rota"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            
            {fretesFiltrados.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <Map size={40} className="text-gray-200" />
                    <p>Nenhuma rota encontrada.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}