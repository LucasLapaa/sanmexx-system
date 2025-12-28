'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Plus, Search, Pencil, Trash2 } from 'lucide-react';

export default function ContratosListaPage() {
  const [contratos, setContratos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca os contratos ao carregar a página
  useEffect(() => {
    fetch('/api/contratos')
      .then(res => res.json())
      .then(data => {
        setContratos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar contratos:", err);
        setLoading(false);
      });
  }, []);

  // Função para Excluir
  const handleDelete = async (id: string) => {
    if(!confirm('Tem certeza que deseja EXCLUIR este contrato permanentemente?')) return;
    
    try {
      const res = await fetch(`/api/contratos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        // Remove o contrato da lista visualmente sem precisar recarregar a página
        setContratos(contratos.filter(c => c.id !== id));
        alert('Contrato excluído com sucesso.');
      } else {
        alert('Erro ao excluir contrato.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
    }
  };

  // Função para definir a cor da etiqueta de status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVO': return 'bg-green-100 text-green-800 border-green-200';
      case 'AGUARDANDO': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONCLUIDO': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELADO': return 'bg-red-100 text-red-800 border-red-200';
      case 'DESATIVADO': return 'bg-gray-200 text-gray-600 border-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Carregando contratos...</div>;

  return (
    <div className="p-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="text-blue-600" /> Gestão de Contratos
        </h1>
        
        {/* Botão Novo Contrato (Note que o ID é 'novo') */}
        <Link href="/dashboard/contratos/novo">
          <button className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition shadow-sm">
            <Plus size={20} /> Novo Contrato
          </button>
        </Link>
      </div>

      {/* Tabela de Listagem */}
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
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contratos.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition">
                <td className="p-4 font-bold text-blue-900">#{c.numero}</td>
                <td className="p-4 uppercase text-sm font-medium">{c.motoristaNome}</td>
                <td className="p-4 text-xs text-slate-500 uppercase">
                  {c.origem} <span className="text-slate-300">➔</span> {c.destino}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getStatusColor(c.status)}`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-500">
                  {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4 text-right font-mono font-medium text-slate-700">
                  R$ {c.valorTotal ? c.valorTotal.toFixed(2) : '0.00'}
                </td>
                
                {/* COLUNA DE AÇÕES (EDITAR E EXCLUIR) */}
                <td className="p-4 flex justify-center gap-2">
                  <Link href={`/dashboard/contratos/${c.id}`}>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition" title="Editar Contrato">
                      <Pencil size={18} />
                    </button>
                  </Link>
                  
                  <button 
                    onClick={() => handleDelete(c.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition" 
                    title="Excluir Contrato"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            
            {contratos.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={40} className="text-slate-200" />
                    <p>Nenhum contrato encontrado no sistema.</p>
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