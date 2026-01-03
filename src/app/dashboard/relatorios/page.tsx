'use client';

import { useState, useEffect } from 'react';
import { FileText, Printer, Filter, Search, DollarSign, Calendar } from 'lucide-react';
import { getRelatorioOperacional, getRelatorioFinanceiro } from '@/app/actions/relatorioActions';
import { getDadosAuxiliares } from '@/app/actions/processoActions';

export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = useState<'OPERACIONAL' | 'FINANCEIRO'>('OPERACIONAL');
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  // Filtros
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    clienteId: '',
    operacao: '',
    processoRef: '' // Só para financeiro
  });

  // Carrega Clientes para o Dropdown
  useEffect(() => {
    getDadosAuxiliares().then(res => setClientes(res.clientes));
  }, []);

  const handleGerar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setReportData(null);

    if (activeTab === 'OPERACIONAL') {
        const dados = await getRelatorioOperacional(filtros);
        setReportData(dados);
    } else {
        const dados = await getRelatorioFinanceiro(filtros);
        setReportData(dados);
    }
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto pb-20 print:p-0 print:max-w-none">
      
      {/* CABEÇALHO (Não sai na impressão se usar print:hidden) */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
           <FileText className="text-blue-600" /> Central de Relatórios
        </h1>
        <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
            <button onClick={() => {setActiveTab('OPERACIONAL'); setReportData(null)}} className={`px-4 py-2 rounded font-bold text-sm ${activeTab === 'OPERACIONAL' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>Operacional</button>
            <button onClick={() => {setActiveTab('FINANCEIRO'); setReportData(null)}} className={`px-4 py-2 rounded font-bold text-sm ${activeTab === 'FINANCEIRO' ? 'bg-white shadow text-green-600' : 'text-slate-500'}`}>Financeiro</button>
        </div>
      </div>

      {/* ÁREA DE FILTROS (Não sai na impressão) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 print:hidden">
        <form onSubmit={handleGerar} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            
            <div className="md:col-span-2 flex gap-2">
                <div className="flex-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Data Início</label>
                    <input type="date" value={filtros.dataInicio} onChange={e => setFiltros({...filtros, dataInicio: e.target.value})} className="w-full p-2 border rounded-lg" />
                </div>
                <div className="flex-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Data Fim</label>
                    <input type="date" value={filtros.dataFim} onChange={e => setFiltros({...filtros, dataFim: e.target.value})} className="w-full p-2 border rounded-lg" />
                </div>
            </div>

            {activeTab === 'OPERACIONAL' ? (
                <>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Cliente</label>
                        <select value={filtros.clienteId} onChange={e => setFiltros({...filtros, clienteId: e.target.value})} className="w-full p-2 border rounded-lg">
                            <option value="">Todos</option>
                            {clientes.map(c => <option key={c.id} value={c.id}>{c.razaoSocial}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Operação</label>
                        <select value={filtros.operacao} onChange={e => setFiltros({...filtros, operacao: e.target.value})} className="w-full p-2 border rounded-lg">
                            <option value="">Todas</option>
                            <option>IMPORTAÇÃO</option>
                            <option>EXPORTAÇÃO</option>
                            <option>CABOTAGEM</option>
                            <option>DTA</option>
                        </select>
                    </div>
                </>
            ) : (
                <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Filtrar Processo (Opcional)</label>
                    <input 
                        type="text" 
                        placeholder="Ref. Sanmexx..." 
                        value={filtros.processoRef} 
                        onChange={e => setFiltros({...filtros, processoRef: e.target.value})} 
                        className="w-full p-2 border rounded-lg" 
                    />
                </div>
            )}

            <button type="submit" disabled={loading} className="bg-slate-800 text-white p-2 rounded-lg font-bold hover:bg-slate-900 flex justify-center items-center gap-2">
                {loading ? 'Gerando...' : 'Gerar Relatório'}
            </button>
        </form>
      </div>

      {/* --- RESULTADOS: OPERACIONAL --- */}
      {activeTab === 'OPERACIONAL' && reportData && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[500px] print:shadow-none print:border-none print:p-0">
            <div className="flex justify-between items-center mb-4 border-b pb-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Relatório Operacional</h2>
                    <p className="text-xs text-slate-500">Período: {filtros.dataInicio || 'Início'} até {filtros.dataFim || 'Hoje'}</p>
                </div>
                <button onClick={handlePrint} className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-1 rounded print:hidden">
                    <Printer size={18} /> Imprimir
                </button>
            </div>

            <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                    <tr>
                        <th className="p-2">Data</th>
                        <th className="p-2">Ref. Sanmexx</th>
                        <th className="p-2">Cliente</th>
                        <th className="p-2">Operação</th>
                        <th className="p-2">Navio/Viagem</th>
                        <th className="p-2">Container</th>
                        <th className="p-2">Mercadoria</th>
                        <th className="p-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.map((proc:any) => (
                        <tr key={proc.id} className="border-b border-slate-200">
                            <td className="p-2">{new Date(proc.dataAbertura).toLocaleDateString('pt-BR')}</td>
                            <td className="p-2 font-bold">{proc.refSanmexx}</td>
                            <td className="p-2">{proc.clienteNome}</td>
                            <td className="p-2">{proc.operacao}</td>
                            <td className="p-2">{proc.navio}</td>
                            <td className="p-2">{proc.container}</td>
                            <td className="p-2">{proc.mercadoria}</td>
                            <td className="p-2 font-bold">{proc.status}</td>
                        </tr>
                    ))}
                    {reportData.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-slate-400">Nenhum registro encontrado.</td></tr>}
                </tbody>
            </table>
        </div>
      )}

      {/* --- RESULTADOS: FINANCEIRO --- */}
      {activeTab === 'FINANCEIRO' && reportData && (
        <div className="space-y-6 print:space-y-4">
            
            {/* Cards de Resumo */}
            <div className="grid grid-cols-3 gap-4 print:grid-cols-3">
                <div className="bg-white p-4 rounded-xl shadow border border-slate-200 print:border-black">
                    <span className="text-xs font-bold text-green-600 uppercase">Total Recebido</span>
                    <div className="text-2xl font-bold text-green-700">R$ {reportData.resumo.totalEntradas.toFixed(2)}</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow border border-slate-200 print:border-black">
                    <span className="text-xs font-bold text-red-600 uppercase">Total Pago</span>
                    <div className="text-2xl font-bold text-red-700">R$ {reportData.resumo.totalSaidas.toFixed(2)}</div>
                </div>
                <div className="bg-slate-800 text-white p-4 rounded-xl shadow border border-slate-900 print:bg-white print:text-black print:border-black">
                    <span className="text-xs font-bold uppercase opacity-70">Saldo do Período</span>
                    <div className="text-2xl font-bold">R$ {reportData.resumo.saldo.toFixed(2)}</div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                    <h2 className="text-xl font-bold text-slate-800">Extrato Financeiro</h2>
                    <button onClick={handlePrint} className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-1 rounded print:hidden">
                        <Printer size={18} /> Imprimir
                    </button>
                </div>

                {/* Tabela de Entradas */}
                <h3 className="font-bold text-green-700 mb-2 mt-4 text-sm uppercase">Entradas (Recebimentos)</h3>
                <table className="w-full text-xs text-left mb-6">
                    <thead className="bg-green-50 border-b border-green-200 font-bold text-green-800">
                        <tr>
                            <th className="p-2">Data</th>
                            <th className="p-2">Nº Fatura</th>
                            <th className="p-2">Processo</th>
                            <th className="p-2">Cliente</th>
                            <th className="p-2 text-right">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.entradas.map((item:any) => (
                            <tr key={item.id} className="border-b border-slate-100">
                                <td className="p-2">{new Date(item.dataEmissao).toLocaleDateString('pt-BR')}</td>
                                <td className="p-2">{item.numero}</td>
                                <td className="p-2">{item.processo.refSanmexx}</td>
                                <td className="p-2">{item.cliente.razaoSocial}</td>
                                <td className="p-2 text-right font-bold text-green-600">R$ {item.valorTotal.toFixed(2)}</td>
                            </tr>
                        ))}
                        {reportData.entradas.length === 0 && <tr><td colSpan={5} className="p-2 text-center text-slate-400">Nenhum recebimento.</td></tr>}
                    </tbody>
                </table>

                {/* Tabela de Saídas */}
                <h3 className="font-bold text-red-700 mb-2 mt-4 text-sm uppercase">Saídas (Pagamentos)</h3>
                <table className="w-full text-xs text-left">
                    <thead className="bg-red-50 border-b border-red-200 font-bold text-red-800">
                        <tr>
                            <th className="p-2">Data Pgto</th>
                            <th className="p-2">Nº Solicitação</th>
                            <th className="p-2">Processo</th>
                            <th className="p-2">Favorecido</th>
                            <th className="p-2">Item</th>
                            <th className="p-2 text-right">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.saidas.map((item:any) => (
                            <tr key={item.id} className="border-b border-slate-100">
                                <td className="p-2">{item.dataPagamento ? new Date(item.dataPagamento).toLocaleDateString('pt-BR') : '-'}</td>
                                <td className="p-2">{item.numero}</td>
                                <td className="p-2">{item.processoRef || '-'}</td>
                                <td className="p-2">{item.favorecidoNome}</td>
                                <td className="p-2">{item.itemNome}</td>
                                <td className="p-2 text-right font-bold text-red-600">R$ {item.valor.toFixed(2)}</td>
                            </tr>
                        ))}
                        {reportData.saidas.length === 0 && <tr><td colSpan={6} className="p-2 text-center text-slate-400">Nenhum pagamento.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
}