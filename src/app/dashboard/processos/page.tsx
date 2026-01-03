'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Trash2, FolderOpen, Truck, Anchor, X, Loader2 } from 'lucide-react';
// Importamos tudo das actions agora
import { createProcesso, getProcessos, deleteProcesso, getDadosAuxiliares } from '@/app/actions/processoActions';

export default function ProcessosPage() {
  // Estados da Página
  const [processos, setProcessos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);

  // 1. Carrega os Processos ao abrir a tela
  useEffect(() => {
    carregarProcessos();
  }, []);

  async function carregarProcessos() {
    setLoading(true);
    const dados = await getProcessos(query);
    setProcessos(dados);
    setLoading(false);
  }

  // 2. Busca (Função do botão Consultar)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    carregarProcessos();
  };

  // 3. Excluir
  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este processo?')) {
      await deleteProcesso(id);
      carregarProcessos(); // Atualiza a lista
    }
  };

  // 4. Abrir Modal (Carrega clientes)
  const handleOpenModal = async () => {
    setIsModalOpen(true);
    const aux = await getDadosAuxiliares();
    setClientes(aux.clientes);
  };

  // 5. Salvar Novo Processo
  const handleCreate = async (formData: FormData) => {
    setModalLoading(true);
    await createProcesso(formData);
    setModalLoading(false);
    setIsModalOpen(false);
    // Recarrega a lista para mostrar o novo
    carregarProcessos(); 
  };

  return (
    <div className="p-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Processos Operacionais</h1>
          <p className="text-slate-500">Gerencie suas operações de ponta a ponta</p>
        </div>
        
        {/* BOTÃO ABRIR NOVO */}
        <button 
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-colors"
        >
          <Plus size={20} /> Abrir Novo
        </button>
      </div>

      {/* BARRA DE CONSULTA */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text" 
              placeholder="Pesquisar por Ref. Sanmexx, Container, Cliente, Booking ou BL..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900">
            Consultar
          </button>
        </form>
      </div>

      {/* TABELA DE RESULTADOS */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[200px]">
        {loading ? (
           <div className="flex justify-center items-center h-40 text-slate-500 gap-2">
             <Loader2 className="animate-spin" /> Carregando processos...
           </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="p-4">Ref. Sanmexx</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Operação</th>
                <th className="p-4">Navio / Motorista</th>
                <th className="p-4">Status</th>
                <th className="p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {processos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Nenhum processo encontrado.
                  </td>
                </tr>
              ) : (
                processos.map((proc) => (
                  <tr key={proc.id} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-blue-700">{proc.refSanmexx}</div>
                      <div className="text-xs text-slate-500">{proc.refCliente || '-'}</div>
                    </td>
                    <td className="p-4 font-medium">{proc.clienteNome}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold 
                        ${proc.operacao === 'IMPORTAÇÃO' ? 'bg-blue-100 text-blue-700' : 
                          proc.operacao === 'EXPORTAÇÃO' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                        {proc.operacao}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-600">
                         {proc.navio ? <Anchor size={14}/> : <Truck size={14}/>}
                         <span>{proc.navio || 'Rodoviário'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold 
                        ${proc.status === 'FINALIZADO' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {proc.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2 items-center">
                      <Link 
                        href={`/dashboard/processos/${proc.id}`} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded" 
                        title="Abrir Manutenção"
                      >
                        <FolderOpen size={18}/>
                      </Link>
                      
                      <button 
                        onClick={() => handleDelete(proc.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded" 
                        title="Excluir"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* --- MODAL (AGORA DENTRO DO MESMO ARQUIVO) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">Novo Processo</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={24} />
                </button>
            </div>
            
            <form action={handleCreate} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cliente *</label>
                    <select name="clienteId" required className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Selecione...</option>
                        {clientes.map(c => (
                            <option key={c.id} value={c.id}>{c.razaoSocial}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ref. Sanmexx</label>
                    <input type="text" value="Será gerado (TR-XXXXX/XX)" disabled className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 text-sm" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ref. Cliente</label>
                    <input type="text" name="refCliente" placeholder="Opcional" className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="flex gap-3 mt-6 pt-2">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700">Cancelar</button>
                    <button type="submit" disabled={modalLoading} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex justify-center items-center gap-2">
                        {modalLoading && <Loader2 className="animate-spin" size={18} />}
                        Registrar
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}