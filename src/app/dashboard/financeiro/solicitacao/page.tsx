'use client';

import { useState, useEffect } from 'react';
import { Save, Search, Plus, FileText, Barcode, Calendar, DollarSign, X } from 'lucide-react';
import { createSolicitacao, getDadosFinanceiros, getSolicitacoes } from '@/app/actions/financeiroActions';

export default function SolicitacaoPagamentoPage() {
  // Estados de Dados
  const [listas, setListas] = useState<any>({ favorecidos: [], itens: [], processos: [] });
  const [solicitacoes, setSolicitacoes] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  
  // Estado do Modal e Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    favorecidoId: '',
    itemId: '',
    processoId: '',
    valor: '',
    dataPagamento: '',
    tipoPagamento: 'Pix', // Padrão
    codigoBarras: ''
  });

  // Carrega dados iniciais
  useEffect(() => {
    carregarListas();
    buscarSolicitacoes();
  }, []);

  async function carregarListas() {
    const dados = await getDadosFinanceiros();
    setListas(dados);
  }

  async function buscarSolicitacoes() {
    const res = await getSolicitacoes(query);
    setSolicitacoes(res);
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    buscarSolicitacoes();
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Limpeza condicional antes de enviar
    const dadosFinais = { ...formData };
    if (dadosFinais.tipoPagamento !== 'Boleto') dadosFinais.codigoBarras = '';
    if (dadosFinais.tipoPagamento === 'DOC') dadosFinais.dataPagamento = ''; // Bloqueado = Vazio

    const res = await createSolicitacao(dadosFinais);
    
    setLoading(false);
    if (res.success) {
      alert(res.message);
      setIsModalOpen(false);
      setFormData({ favorecidoId: '', itemId: '', processoId: '', valor: '', dataPagamento: '', tipoPagamento: 'Pix', codigoBarras: '' });
      buscarSolicitacoes();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Solicitação de Pagamento</h1>
          <p className="text-slate-500">Controle de saídas e agendamentos</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md">
           <Plus size={20} /> Nova Solicitação
        </button>
      </div>

      {/* CONSULTA */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
             <input 
               type="text" 
               value={query} onChange={e => setQuery(e.target.value)}
               placeholder="Buscar por Nº Solicitação, Favorecido ou Processo..."
               className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
             />
          </div>
          <button type="submit" className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-900">Consultar</button>
        </form>
      </div>

      {/* LISTAGEM */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
           <thead className="bg-slate-50 border-b text-slate-600">
             <tr>
               <th className="p-4">Nº Solicitação</th>
               <th className="p-4">Favorecido</th>
               <th className="p-4">Item</th>
               <th className="p-4">Processo</th>
               <th className="p-4">Valor</th>
               <th className="p-4">Tipo</th>
               <th className="p-4">Status</th>
             </tr>
           </thead>
           <tbody>
             {solicitacoes.length === 0 ? (
               <tr><td colSpan={7} className="p-8 text-center text-slate-500">Nenhuma solicitação encontrada.</td></tr>
             ) : (
               solicitacoes.map(sol => (
                 <tr key={sol.id} className="border-b hover:bg-slate-50">
                   <td className="p-4 font-bold text-blue-700">{sol.numero}</td>
                   <td className="p-4">{sol.favorecidoNome}</td>
                   <td className="p-4">{sol.itemNome}</td>
                   <td className="p-4 font-mono text-xs">{sol.processoRef || '-'}</td>
                   <td className="p-4 font-bold text-red-600">R$ {sol.valor.toFixed(2)}</td>
                   <td className="p-4">{sol.tipoPagamento}</td>
                   <td className="p-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">{sol.status}</span></td>
                 </tr>
               ))
             )}
           </tbody>
        </table>
      </div>

      {/* MODAL DE CADASTRO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
             <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-xl font-bold text-slate-800">Nova Solicitação</h2>
                <button onClick={() => setIsModalOpen(false)}><X className="text-slate-400 hover:text-red-500" /></button>
             </div>

             <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Favorecido *</label>
                      <select name="favorecidoId" required value={formData.favorecidoId} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white">
                        <option value="">Selecione...</option>
                        {listas.favorecidos.map((f:any) => <option key={f.id} value={f.id}>{f.razaoSocial}</option>)}
                      </select>
                   </div>
                   
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Item (Tipo) *</label>
                      <select name="itemId" required value={formData.itemId} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white">
                        <option value="">Selecione...</option>
                        {listas.itens.map((i:any) => <option key={i.id} value={i.id}>{i.nome}</option>)}
                      </select>
                   </div>
                   
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Processo (Opcional)</label>
                      <select name="processoId" value={formData.processoId} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white">
                        <option value="">Sem vínculo</option>
                        {listas.processos.map((p:any) => <option key={p.id} value={p.id}>{p.refSanmexx} - {p.clienteNome}</option>)}
                      </select>
                   </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$) *</label>
                      <div className="relative">
                         <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                         <input type="number" name="valor" required step="0.01" value={formData.valor} onChange={handleChange} className="w-full pl-8 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tipo Pagamento *</label>
                      <select name="tipoPagamento" value={formData.tipoPagamento} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white">
                        <option value="Pix">Pix</option>
                        <option value="Boleto">Boleto</option>
                        <option value="Cheque">Cheque</option>
                        <option value="DOC">DOC</option>
                      </select>
                   </div>

                   {/* CAMPO DATA - Lógica de bloqueio DOC */}
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Data Pagamento</label>
                      <div className="relative">
                         <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                         <input 
                            type="date" 
                            name="dataPagamento" 
                            value={formData.dataPagamento} 
                            onChange={handleChange}
                            disabled={formData.tipoPagamento === 'DOC'} 
                            className={`w-full pl-8 p-2 border rounded-lg outline-none ${formData.tipoPagamento === 'DOC' ? 'bg-slate-200 cursor-not-allowed text-slate-400' : 'bg-white focus:ring-2 focus:ring-blue-500'}`} 
                         />
                      </div>
                      {formData.tipoPagamento === 'DOC' && <span className="text-xs text-red-500">* Bloqueado para DOC</span>}
                   </div>

                   {/* CAMPO CÓDIGO BARRAS - Só se Boleto */}
                   {formData.tipoPagamento === 'Boleto' && (
                     <div className="col-span-2 animate-in fade-in slide-in-from-top-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Código de Barras</label>
                        <div className="relative">
                           <Barcode className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                           <input type="text" name="codigoBarras" value={formData.codigoBarras} onChange={handleChange} className="w-full pl-8 p-2 border border-blue-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Digite o código do boleto..." />
                        </div>
                     </div>
                   )}
                </div>

                <div className="flex justify-end pt-4">
                   <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2">
                     {loading ? 'Salvando...' : <><Save size={20} /> Registrar Solicitação</>}
                   </button>
                </div>

             </form>
          </div>
        </div>
      )}
    </div>
  );
}