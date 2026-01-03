'use client';

import { useState, useEffect } from 'react';
import { Search, CheckCircle, Upload, AlertTriangle, FileText, Barcode, X, CreditCard } from 'lucide-react';
import { getContasAPagar, pagarContaAction, anexarArquivoAction } from '@/app/actions/financeiroActions';

export default function ContasAPagarPage() {
  const [contas, setContas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  
  // Estado para Modal de Anexo
  const [anexoModal, setAnexoModal] = useState<{id: string, tipo: 'boleto'|'comprovante'|'recibo'} | null>(null);

  useEffect(() => {
    carregarContas();
    
    // Configura o ALERTA DE 30 MINUTOS
    const checkAlertas = () => {
        const hoje = new Date().toISOString().split('T')[0];
        const pendentesHoje = document.querySelectorAll('.vence-hoje'); // Gambiarra inteligente via DOM ou State
        // Melhor via state:
        setContas(currentContas => {
            const temVencendo = currentContas.some(c => {
                const dataVenc = c.dataPagamento ? new Date(c.dataPagamento).toISOString().split('T')[0] : '';
                return dataVenc === hoje && c.status === 'PENDENTE';
            });
            
            if (temVencendo) {
                // Toca um som ou mostra alerta
                alert("⚠️ ATENÇÃO: Existem pagamentos vencendo hoje que ainda não foram pagos!");
            }
            return currentContas;
        });
    };

    // Roda verificação inicial após 2 segundos
    setTimeout(checkAlertas, 2000);

    // Roda a cada 30 minutos (30 * 60 * 1000)
    const intervalo = setInterval(checkAlertas, 1800000); 

    return () => clearInterval(intervalo);
  }, []);

  async function carregarContas() {
    setLoading(true);
    const dados = await getContasAPagar(filtro);
    setContas(dados);
    setLoading(false);
  }

  const handlePagar = async (id: string) => {
    if (confirm('Confirmar o pagamento desta conta?')) {
        await pagarContaAction(id);
        carregarContas();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    carregarContas();
  };

  // Simula upload
  const handleFileUpload = async (e: any) => {
    if (!anexoModal || !e.target.files[0]) return;
    // Num sistema real, aqui você enviaria o arquivo.
    // Vamos simular salvando o nome.
    await anexarArquivoAction(anexoModal.id, anexoModal.tipo, e.target.files[0].name);
    setAnexoModal(null);
    carregarContas();
    alert("Arquivo anexado com sucesso!");
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto pb-20">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <CreditCard /> Contas a Pagar
      </h1>

      {/* FILTRO */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
         <form onSubmit={handleSearch} className="flex gap-4">
            <input 
                type="text" 
                value={filtro} onChange={e => setFiltro(e.target.value)}
                placeholder="Pesquisar por Fornecedor, Ref. Sanmexx ou Nº Solicitação..."
                className="flex-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold">Filtrar</button>
         </form>
      </div>

      {/* TABELA GRID EXCEL */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
         <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
               <tr>
                  <th className="p-3 border-r">Nº Solicitação</th>
                  <th className="p-3 border-r text-blue-700">Ref. Sanmexx</th>
                  <th className="p-3 border-r">Ref. Cliente</th>
                  <th className="p-3 border-r">Favorecido</th>
                  <th className="p-3 border-r">Valor Total</th>
                  <th className="p-3 border-r">Tipo</th>
                  <th className="p-3 border-r">Banco</th>
                  <th className="p-3 border-r">Agência</th>
                  <th className="p-3 border-r">Conta/Pix</th>
                  <th className="p-3 border-r">Vencimento</th>
                  <th className="p-3 border-r">Cód. Barras</th>
                  <th className="p-3 border-r">Anexos</th>
                  <th className="p-3 text-center">Ações</th>
               </tr>
            </thead>
            <tbody>
               {loading ? <tr><td colSpan={13} className="p-10 text-center">Carregando...</td></tr> : 
                contas.map(conta => {
                    const hoje = new Date().toISOString().split('T')[0];
                    const vencto = conta.dataPagamento ? new Date(conta.dataPagamento).toISOString().split('T')[0] : '';
                    const venceHoje = vencto === hoje && conta.status === 'PENDENTE';
                    const atrasada = vencto < hoje && conta.status === 'PENDENTE';

                    return (
                        <tr key={conta.id} className={`border-b hover:bg-blue-50 ${venceHoje ? 'bg-yellow-50 vence-hoje' : ''} ${atrasada ? 'bg-red-50' : ''}`}>
                            <td className="p-3 border-r">{conta.numero}</td>
                            <td className="p-3 border-r font-bold text-blue-700">{conta.processoRef || '-'}</td>
                            <td className="p-3 border-r">{conta.processo?.refCliente || '-'}</td>
                            <td className="p-3 border-r font-medium">{conta.favorecidoNome}</td>
                            <td className="p-3 border-r font-bold text-slate-700">R$ {conta.valor.toFixed(2)}</td>
                            <td className="p-3 border-r">{conta.tipoPagamento}</td>
                            
                            {/* DADOS BANCÁRIOS (Vindo do Favorecido) */}
                            <td className="p-3 border-r">{conta.favorecido?.banco || '-'}</td>
                            <td className="p-3 border-r">{conta.favorecido?.agencia || '-'}</td>
                            <td className="p-3 border-r">{conta.favorecido?.conta || conta.favorecido?.chavePix || '-'}</td>
                            
                            <td className="p-3 border-r font-bold">
                                {conta.dataPagamento ? new Date(conta.dataPagamento).toLocaleDateString('pt-BR') : 'DOC'}
                                {venceHoje && <span className="ml-2 text-yellow-600 animate-pulse">⚠ Hoje</span>}
                                {atrasada && <span className="ml-2 text-red-600 font-bold">! Atrasado</span>}
                            </td>
                            
                            <td className="p-3 border-r max-w-[150px] overflow-hidden text-ellipsis" title={conta.codigoBarras}>
                                {conta.codigoBarras ? <span className="flex items-center gap-1 text-xs"><Barcode size={14}/> {conta.codigoBarras}</span> : '-'}
                            </td>

                            {/* COLUNA ANEXOS */}
                            <td className="p-3 border-r flex gap-2">
                                <button title="Anexar Boleto" onClick={() => setAnexoModal({id: conta.id, tipo: 'boleto'})} className={`p-1 rounded ${conta.urlBoleto ? 'text-green-600 bg-green-100' : 'text-slate-400 hover:text-blue-600'}`}>
                                    <FileText size={16} />
                                </button>
                                <button title="Anexar Comprovante" onClick={() => setAnexoModal({id: conta.id, tipo: 'comprovante'})} className={`p-1 rounded ${conta.urlComprovante ? 'text-green-600 bg-green-100' : 'text-slate-400 hover:text-blue-600'}`}>
                                    <CheckCircle size={16} />
                                </button>
                                <button title="Anexar Recibo" onClick={() => setAnexoModal({id: conta.id, tipo: 'recibo'})} className={`p-1 rounded ${conta.urlRecibo ? 'text-green-600 bg-green-100' : 'text-slate-400 hover:text-blue-600'}`}>
                                    <FileText size={16} />
                                </button>
                            </td>

                            <td className="p-3 text-center">
                                {conta.status === 'PAGO' ? (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-xs">
                                        <CheckCircle size={12} /> PAGO
                                    </span>
                                ) : (
                                    <button 
                                        onClick={() => handlePagar(conta.id)}
                                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-xs font-bold shadow-sm transition-transform active:scale-95"
                                    >
                                        PAGAR
                                    </button>
                                )}
                            </td>
                        </tr>
                    );
                })
               }
            </tbody>
         </table>
      </div>

      {/* MODAL DE UPLOAD SIMPLES */}
      {anexoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h3 className="font-bold text-lg mb-4 capitalize">Anexar {anexoModal.tipo}</h3>
                <input type="file" onChange={handleFileUpload} className="block w-full text-sm text-slate-500 mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                <button onClick={() => setAnexoModal(null)} className="text-sm text-slate-500 underline w-full text-center">Cancelar</button>
            </div>
        </div>
      )}
    </div>
  );
}