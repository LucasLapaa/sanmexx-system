'use client';

import { useState, useEffect } from 'react';
import { Search, FileText, CheckCircle, Printer, Plus, AlertCircle, Edit } from 'lucide-react';
import { getContasReceber, receberContaAction, updateInfoComplementar } from '@/app/actions/financeiroReceberActions';
import { getProcessos } from '@/app/actions/processoActions';
import { gerarContaReceberAction } from '@/app/actions/financeiroReceberActions';

export default function ContasReceberPage() {
  const [contas, setContas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  
  // Modal para Gerar Nova (Busca Processos Finalizados)
  const [modalOpen, setModalOpen] = useState(false);
  const [processosCandidatos, setProcessosCandidatos] = useState<any[]>([]);
  
  // Modal Info Complementar
  const [editInfo, setEditInfo] = useState<{id: string, text: string} | null>(null);

  useEffect(() => {
    carregarContas();
  }, []);

  async function carregarContas() {
    setLoading(true);
    const dados = await getContasReceber(busca);
    setContas(dados);
    setLoading(false);
  }

  // Busca processos para gerar fatura
  const abrirModalGerar = async () => {
    setModalOpen(true);
    // Busca processos finalizados que ainda não têm conta (Isso seria ideal filtrar no backend, 
    // mas aqui vamos buscar tudo e filtrar visualmente por simplificação ou criar action especifica)
    const procs = await getProcessos(''); 
    // Filtra apenas status FINALIZADO (Assumindo que sua regra de negócio exige isso)
    setProcessosCandidatos(procs.filter((p:any) => p.status === 'FINALIZADO'));
  };

  const handleGerar = async (processoId: string) => {
    if(!confirm("Gerar Fatura para este processo?")) return;
    const res = await gerarContaReceberAction(processoId);
    if(res.success) {
        alert(res.message);
        setModalOpen(false);
        carregarContas();
    } else {
        alert(res.message);
    }
  };

  const handleReceber = async (id: string) => {
    if(confirm("Confirmar recebimento?")) {
        await receberContaAction(id);
        carregarContas();
    }
  };

  const handlePrint = (id: string) => {
    window.open(`/dashboard/financeiro/fatura/print?id=${id}`, '_blank');
  };

  const salvarInfo = async () => {
    if(editInfo) {
        await updateInfoComplementar(editInfo.id, editInfo.text);
        setEditInfo(null);
        carregarContas();
    }
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-emerald-600" /> Contas a Receber (Faturamento)
         </h1>
         <button onClick={abrirModalGerar} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 shadow flex items-center gap-2">
            <Plus size={20} /> Gerar Fatura de Processo
         </button>
      </div>

      {/* BUSCA */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
         <form onSubmit={(e)=>{e.preventDefault(); carregarContas()}} className="flex gap-4">
            <input type="text" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Pesquisar Fatura, Ref. Sanmexx ou Cliente..." className="flex-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
            <button type="submit" className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold">Filtrar</button>
         </form>
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <table className="w-full text-sm text-left">
            <thead className="bg-emerald-50 text-emerald-900 font-bold border-b border-emerald-200">
               <tr>
                  <th className="p-4">Nº Fatura</th>
                  <th className="p-4">Ref. Sanmexx</th>
                  <th className="p-4">Ref. Cliente</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Valor Total</th>
                  <th className="p-4">Vencimento</th>
                  <th className="p-4">Info. Complementar</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Ações</th>
               </tr>
            </thead>
            <tbody>
               {contas.map(conta => (
                   <tr key={conta.id} className="border-b hover:bg-slate-50">
                       <td className="p-4 font-bold">{conta.numero}</td>
                       <td className="p-4 font-mono text-blue-600">{conta.processo.refSanmexx}</td>
                       <td className="p-4">{conta.processo.refCliente || '-'}</td>
                       <td className="p-4">{conta.cliente.razaoSocial}</td>
                       <td className="p-4 font-bold text-emerald-700">R$ {conta.valorTotal.toFixed(2)}</td>
                       <td className="p-4">{new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}</td>
                       <td className="p-4 flex items-center gap-2 text-xs text-slate-500 max-w-[200px] truncate">
                           {conta.infoComplementar || '...'}
                           <button onClick={() => setEditInfo({id: conta.id, text: conta.infoComplementar || ''})} className="text-blue-500 hover:text-blue-700"><Edit size={14}/></button>
                       </td>
                       <td className="p-4 text-center">
                           {conta.status === 'RECEBIDO' 
                             ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">RECEBIDO</span>
                             : <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">PENDENTE</span>
                           }
                       </td>
                       <td className="p-4 flex justify-center gap-2">
                           <button onClick={() => handlePrint(conta.id)} title="Imprimir Nota de Débito" className="p-2 bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600 rounded"><Printer size={18}/></button>
                           {conta.status !== 'RECEBIDO' && (
                               <button onClick={() => handleReceber(conta.id)} title="Marcar como Recebido" className="p-2 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 rounded"><CheckCircle size={18}/></button>
                           )}
                       </td>
                   </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* MODAL GERAR */}
      {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                  <h2 className="text-xl font-bold mb-4">Gerar Fatura (Processos Finalizados)</h2>
                  <div className="space-y-2">
                      {processosCandidatos.length === 0 ? <p className="text-slate-500">Nenhum processo finalizado disponível para faturamento.</p> :
                       processosCandidatos.map(p => (
                           <div key={p.id} className="flex justify-between items-center p-3 border rounded hover:bg-slate-50">
                               <div>
                                   <div className="font-bold text-blue-700">{p.refSanmexx}</div>
                                   <div className="text-sm">{p.clienteNome}</div>
                               </div>
                               <button onClick={() => handleGerar(p.id)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Gerar Fatura</button>
                           </div>
                       ))
                      }
                  </div>
                  <button onClick={() => setModalOpen(false)} className="mt-4 w-full text-slate-500 underline">Fechar</button>
              </div>
          </div>
      )}

      {/* MODAL EDITAR INFO */}
      {editInfo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl w-96">
                  <h3 className="font-bold mb-2">Informações Complementares</h3>
                  <textarea 
                    value={editInfo.text} 
                    onChange={e => setEditInfo({...editInfo, text: e.target.value})}
                    className="w-full border p-2 rounded h-32 text-sm"
                  />
                  <div className="flex gap-2 mt-4">
                      <button onClick={() => setEditInfo(null)} className="flex-1 border p-2 rounded">Cancelar</button>
                      <button onClick={salvarInfo} className="flex-1 bg-blue-600 text-white p-2 rounded">Salvar</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}