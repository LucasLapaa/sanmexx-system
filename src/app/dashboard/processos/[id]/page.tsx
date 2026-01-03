'use client';

import { useState, useEffect } from 'react';
import { Save, ArrowLeft, FileText, Anchor, Truck, Package, DollarSign, Download, Search } from 'lucide-react';
import { getDadosAuxiliares, updateProcesso, getProcessoUnico, importarCotacaoAction, salvarFinanceiroAction } from '@/app/actions/processoActions';

// Lista Suspensa Padrão (conforme sua imagem)
const ITENS_PADRAO = ['FRETE PESO', 'PEDÁGIO', 'DESPACHO', 'SEGURO', 'MARGEM ESQUERDA', 'PRE-STACKING', 'OUTROS'];

export default function ManutencaoProcessoPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('operacional'); // Controla a aba
  const [loading, setLoading] = useState(false);
  const [auxData, setAuxData] = useState<any>(null);
  
  // Dados do Processo e Financeiro
  const [formData, setFormData] = useState<any>({});
  const [itensCompra, setItensCompra] = useState<any[]>([]);
  const [itensVenda, setItensVenda] = useState<any[]>([]);
  const [cotacaoBusca, setCotacaoBusca] = useState('');

  // Carrega dados ao abrir
  useEffect(() => {
    carregarTudo();
  }, []);

  async function carregarTudo() {
    const aux = await getDadosAuxiliares();
    setAuxData(aux);
    
    const proc = await getProcessoUnico(params.id);
    if (proc) {
      setFormData(proc);
      // Separa itens salvos nas listas certas
      setItensCompra(proc.itensFinanceiros.filter((i:any) => i.tipo === 'COMPRA'));
      setItensVenda(proc.itensFinanceiros.filter((i:any) => i.tipo === 'VENDA'));
      
      // Se estiver vazio, inicia com linhas padrão zeradas
      if (proc.itensFinanceiros.length === 0) {
        setItensCompra(ITENS_PADRAO.map(nome => ({ nome, valor: 0, tipo: 'COMPRA' })));
        setItensVenda(ITENS_PADRAO.map(nome => ({ nome, valor: 0, tipo: 'VENDA' })));
      }
    }
  }

  // --- HANDLERS OPERACIONAIS ---
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSaveOperacional = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await updateProcesso(params.id, formData);
    setLoading(false);
    alert("Dados operacionais salvos!");
  };

  // --- HANDLERS FINANCEIROS ---
  const handleFinanceiroChange = (tipo: 'COMPRA' | 'VENDA', index: number, campo: 'nome' | 'valor', valor: any) => {
    const lista = tipo === 'COMPRA' ? [...itensCompra] : [...itensVenda];
    lista[index][campo] = campo === 'valor' ? Number(valor) : valor;
    
    if (tipo === 'COMPRA') setItensCompra(lista);
    else setItensVenda(lista);
  };

  const handleImportarCotacao = async () => {
    if (!cotacaoBusca) return alert("Digite o número da cotação (Ex: C0001/26)");
    setLoading(true);
    const res = await importarCotacaoAction(params.id, cotacaoBusca);
    setLoading(false);
    alert(res.message);
    if (res.success) carregarTudo(); // Recarrega para mostrar os valores
  };

  const handleSaveFinanceiro = async () => {
    setLoading(true);
    const todosItens = [...itensCompra.map(i => ({...i, tipo: 'COMPRA'})), ...itensVenda.map(i => ({...i, tipo: 'VENDA'}))];
    const res = await salvarFinanceiroAction(params.id, todosItens);
    setLoading(false);
    alert(res.message);
  };

  // Cálculos de Total
  const totalCompra = itensCompra.reduce((acc, i) => acc + (i.valor || 0), 0);
  const totalVenda = itensVenda.reduce((acc, i) => acc + (i.valor || 0), 0);
  const lucro = totalVenda - totalCompra;

  if (!auxData || !formData.id) return <div className="p-10 flex gap-2"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div> Carregando...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-20">
      
      {/* CABEÇALHO COM ABAS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
            <button type="button" onClick={() => window.location.href='/dashboard/processos'} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeft /></button>
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Processo {formData.refSanmexx}</h1>
                <p className="text-slate-500 text-sm">{formData.clienteNome}</p>
            </div>
        </div>

        {/* BOTÕES DAS ABAS */}
        <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
            <button 
                onClick={() => setActiveTab('operacional')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'operacional' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Dados Operacionais
            </button>
            <button 
                onClick={() => setActiveTab('financeiro')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'financeiro' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Compra / Venda
            </button>
        </div>
      </div>

      {/* --- CONTEÚDO DA ABA OPERACIONAL --- */}
      {activeTab === 'operacional' && (
        <form onSubmit={handleSaveOperacional} className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
            {/* ... (Todo o formulário operacional antigo fica aqui) ... */}
            {/* Vou resumir para caber na resposta, mas você mantém o código anterior completo aqui dentro */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-700 mb-4 border-b pb-2 flex items-center gap-2"><FileText size={18}/> Informações Iniciais</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2"><label className="label">Cliente</label><input value={formData.clienteNome} disabled className="input bg-slate-100" /></div>
                    <div><label className="label">Ref. Cliente</label><input name="refCliente" value={formData.refCliente||''} onChange={handleChange} className="input" /></div>
                    <div><label className="label">Operação</label><select name="operacao" value={formData.operacao} onChange={handleChange} className="input"><option>IMPORTAÇÃO</option><option>EXPORTAÇÃO</option><option>CABOTAGEM</option><option>DTA</option></select></div>
                    {/* ... Resto dos campos operacionais ... */}
                </div>
            </div>
            
            {/* Botão Salvar Operacional flutuante ou no final */}
            <div className="col-span-full flex justify-end">
                <button type="submit" disabled={loading} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-bold shadow-lg">
                    <Save size={20} /> Salvar Operacional
                </button>
            </div>
        </form>
      )}

      {/* --- CONTEÚDO DA ABA FINANCEIRA (NOVO) --- */}
      {activeTab === 'financeiro' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
            
            {/* BARRA DE IMPORTAÇÃO */}
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex flex-wrap items-center gap-4 justify-between">
                <div className="flex items-center gap-2 text-emerald-800">
                    <DollarSign />
                    <span className="font-bold">Importar Valores da Cotação</span>
                </div>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Nº Cotação (Ex: C0001/26)" 
                        value={cotacaoBusca}
                        onChange={(e) => setCotacaoBusca(e.target.value)}
                        className="px-4 py-2 border border-emerald-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 uppercase w-60"
                    />
                    <button 
                        onClick={handleImportarCotacao}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-bold flex items-center gap-2"
                    >
                        <Download size={18} /> Importar p/ Venda
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* COLUNA COMPRA */}
                <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
                    <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
                        <h3 className="font-bold text-red-800">COMPRA FRETE (Custos)</h3>
                        <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">Saídas</span>
                    </div>
                    <div className="p-4 space-y-2">
                        {itensCompra.map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <select 
                                    value={item.nome}
                                    onChange={(e) => handleFinanceiroChange('COMPRA', idx, 'nome', e.target.value)}
                                    className="flex-1 p-2 border rounded text-sm bg-slate-50"
                                >
                                    {ITENS_PADRAO.map(opt => <option key={opt}>{opt}</option>)}
                                </select>
                                <div className="relative w-32">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">R$</span>
                                    <input 
                                        type="number" 
                                        value={item.valor}
                                        onChange={(e) => handleFinanceiroChange('COMPRA', idx, 'valor', e.target.value)}
                                        className="w-full pl-6 p-2 border rounded text-sm text-right font-medium outline-none focus:border-red-400"
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-between items-center pt-4 mt-4 border-t border-dashed">
                            <span className="font-bold text-slate-600">TOTAL COMPRA</span>
                            <span className="text-xl font-bold text-red-600">R$ {totalCompra.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* COLUNA VENDA */}
                <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
                    <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex justify-between items-center">
                        <h3 className="font-bold text-emerald-800">VENDA FRETE (Receita)</h3>
                        <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-1 rounded">Entradas</span>
                    </div>
                    <div className="p-4 space-y-2">
                        {itensVenda.map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <select 
                                    value={item.nome}
                                    onChange={(e) => handleFinanceiroChange('VENDA', idx, 'nome', e.target.value)}
                                    className="flex-1 p-2 border rounded text-sm bg-slate-50"
                                >
                                    {ITENS_PADRAO.map(opt => <option key={opt}>{opt}</option>)}
                                </select>
                                <div className="relative w-32">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">R$</span>
                                    <input 
                                        type="number" 
                                        value={item.valor}
                                        onChange={(e) => handleFinanceiroChange('VENDA', idx, 'valor', e.target.value)}
                                        className="w-full pl-6 p-2 border rounded text-sm text-right font-medium outline-none focus:border-emerald-400"
                                    />
                                </div>
                            </div>
                        ))}
                         <div className="flex justify-between items-center pt-4 mt-4 border-t border-dashed">
                            <span className="font-bold text-slate-600">TOTAL VENDA</span>
                            <span className="text-xl font-bold text-emerald-600">R$ {totalVenda.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* BARRA DE LUCRO E SALVAR */}
            <div className="bg-slate-800 text-white p-6 rounded-xl flex justify-between items-center shadow-lg">
                <div>
                    <span className="block text-slate-400 text-sm uppercase tracking-wider">Resultado Previsto (Lucro)</span>
                    <span className={`text-3xl font-bold ${lucro >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        R$ {lucro.toFixed(2)}
                    </span>
                </div>
                <button 
                    onClick={handleSaveFinanceiro}
                    disabled={loading}
                    className="bg-white text-slate-900 px-8 py-3 rounded-lg hover:bg-slate-200 font-bold flex items-center gap-2"
                >
                    <Save size={20} /> Salvar Financeiro
                </button>
            </div>

        </div>
      )}

      {/* Styles para os inputs operacionais */}
      <style jsx>{`
        .label { display: block; font-size: 0.875rem; color: #475569; margin-bottom: 0.25rem; font-weight: 500; }
        .input { width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; outline: none; transition: all; }
        .input:focus { ring: 2px; ring-color: #3b82f6; border-color: #3b82f6; }
      `}</style>
    </div>
  );
}