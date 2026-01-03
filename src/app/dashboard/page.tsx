'use client';

import { useState } from 'react';
import { Search, Filter, FolderOpen, CheckCircle, List } from 'lucide-react';

// 1. Tipo de dados do Processo (Baseado na sua imagem)
interface Processo {
  id: string;
  idCliente: string;
  cliente: string;
  planta: string;
  abertura: string;
  refCliente: string;
  processo: string;
  operacao: 'Exportação' | 'Importação';
  ordemColeta: string;
  status: 'Em Andamento' | 'Finalizado'; // Campo invisível para controle do filtro
}

// 2. Dados de Exemplo (Mock Data)
const dadosIniciais: Processo[] = [
  {
    id: '1',
    idCliente: '11514830',
    cliente: 'Longping High - Tech',
    planta: 'Cravinhos',
    abertura: '11/08/2025',
    refCliente: 'EXP-MAQ.EQ-TAN-0362',
    processo: 'TR-00001/25',
    operacao: 'Exportação',
    ordemColeta: '00001/25',
    status: 'Em Andamento'
  },
  {
    id: '2',
    idCliente: '11514830',
    cliente: 'Longping High - Tech',
    planta: 'Cravinhos',
    abertura: '30/08/2025',
    refCliente: 'IMP-MAQ.EQ-CHI-0374',
    processo: 'TR-00002/25',
    operacao: 'Importação',
    ordemColeta: '00002/25',
    status: 'Finalizado'
  },
  {
    id: '3',
    idCliente: '2504825',
    cliente: 'Ams Log',
    planta: 'Piracicaba',
    abertura: '09/09/2025',
    refCliente: '09AMS1169/25',
    processo: 'TR-00003/25',
    operacao: 'Exportação',
    ordemColeta: '00003/25',
    status: 'Em Andamento'
  },
  {
    id: '4',
    idCliente: '10505028',
    cliente: 'Inter Mundi Global',
    planta: 'Piracicaba',
    abertura: '17/11/2025',
    refCliente: 'SSZ1713401',
    processo: 'TR-00006/25-1',
    operacao: 'Exportação',
    ordemColeta: '00006/25',
    status: 'Em Andamento'
  },
  {
    id: '5',
    idCliente: '10505028',
    cliente: 'Inter Mundi Global',
    planta: 'Santo André',
    abertura: '15/10/2025',
    refCliente: '08AMS1047/25',
    processo: 'TR-00005/25',
    operacao: 'Importação',
    ordemColeta: '00005/25',
    status: 'Finalizado'
  }
];

export default function DashboardPage() {
  const [filtroStatus, setFiltroStatus] = useState<'Todos' | 'Em Andamento' | 'Finalizado'>('Em Andamento');

  // Lógica de Filtragem
  const processosFiltrados = dadosIniciais.filter(p => {
    if (filtroStatus === 'Todos') return true;
    return p.status === filtroStatus;
  });

  // Cores dos botões de filtro
  const getFilterStyle = (tipo: string) => {
    return filtroStatus === tipo
      ? 'bg-blue-600 text-white shadow-md'
      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200';
  };

  return (
    <div className="space-y-6">
      
      {/* Título e Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Painel de Controle</h1>
          <p className="text-slate-500">Acompanhamento de processos logísticos</p>
        </div>

        {/* BOTÕES DE FILTRO (3 OPÇÕES) */}
        <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
          <button 
            onClick={() => setFiltroStatus('Todos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filtroStatus === 'Todos' ? 'bg-white shadow text-blue-700' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <List size={16} />
            Todos
          </button>
          
          <button 
            onClick={() => setFiltroStatus('Em Andamento')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filtroStatus === 'Em Andamento' ? 'bg-white shadow text-blue-700' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FolderOpen size={16} />
            Em Andamento
          </button>
          
          <button 
            onClick={() => setFiltroStatus('Finalizado')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filtroStatus === 'Finalizado' ? 'bg-white shadow text-green-700' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <CheckCircle size={16} />
            Finalizados
          </button>
        </div>
      </div>

      {/* TABELA ESTILO PLANILHA (IGUAL FOTO) */}
      <div className="bg-white border border-slate-300 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans">
            {/* CABEÇALHO AZUL FORTE */}
            <thead className="bg-blue-700 text-white uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3 border-r border-blue-600 whitespace-nowrap">ID Cliente</th>
                <th className="px-4 py-3 border-r border-blue-600 whitespace-nowrap">Cliente</th>
                <th className="px-4 py-3 border-r border-blue-600 whitespace-nowrap">Planta</th>
                <th className="px-4 py-3 border-r border-blue-600 whitespace-nowrap">Abertura</th>
                <th className="px-4 py-3 border-r border-blue-600 whitespace-nowrap">Ref. Cliente</th>
                <th className="px-4 py-3 border-r border-blue-600 whitespace-nowrap">Processo</th>
                <th className="px-4 py-3 border-r border-blue-600 whitespace-nowrap">Operação</th>
                <th className="px-4 py-3 whitespace-nowrap">Ordem Coleta</th>
              </tr>
            </thead>
            
            {/* CORPO DA TABELA */}
            <tbody className="divide-y divide-slate-200">
              {processosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Nenhum processo encontrado neste filtro.
                  </td>
                </tr>
              ) : (
                processosFiltrados.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-blue-50 transition-colors ${
                      // Alterna cor de fundo leve para facilitar leitura
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                    }`}
                  >
                    <td className="px-4 py-2 font-bold text-blue-700 border-r border-slate-200">{item.idCliente}</td>
                    <td className="px-4 py-2 font-semibold text-blue-900 italic border-r border-slate-200">{item.cliente}</td>
                    <td className="px-4 py-2 font-semibold text-blue-800 italic border-r border-slate-200">{item.planta}</td>
                    <td className="px-4 py-2 text-blue-700 font-bold border-r border-slate-200">{item.abertura}</td>
                    <td className="px-4 py-2 font-semibold text-blue-800 border-r border-slate-200">{item.refCliente}</td>
                    <td className="px-4 py-2 font-bold text-blue-700 border-r border-slate-200">{item.processo}</td>
                    <td className="px-4 py-2 font-semibold text-blue-800 italic border-r border-slate-200">{item.operacao}</td>
                    <td className="px-4 py-2 text-blue-700 font-bold">{item.ordemColeta}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Rodapé informativo */}
      <div className="text-right text-xs text-slate-400">
        Mostrando {processosFiltrados.length} registros • Última atualização: Hoje 14:30
      </div>
    </div>
  );
}