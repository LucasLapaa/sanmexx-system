'use client';

import { useState } from 'react';
import { Save, User, Building, CreditCard, MapPin } from 'lucide-react';
import { saveFavorecidoCompleto, saveItemDespesa } from '@/app/actions/financeiroActions';

export default function CadastrosFinanceiroPage() {
  const [activeTab, setActiveTab] = useState<'PJ' | 'PF'>('PJ');
  const [loading, setLoading] = useState(false);
  
  // Estado do Formulário Favorecido
  const [formData, setFormData] = useState<any>({
    razaoSocial: '', cnpj: '', rg: '', mei: '',
    endereco: '', complemento: '', bairro: '', cidade: '', uf: '', pais: 'Brasil', codigoPostal: '',
    telefone: '', pessoaContato: '', inscricaoEstadual: '', inscricaoMunicipal: '',
    banco: '', agencia: '', conta: '', chavePix: '', favorecidoBanco: ''
  });

  // Estado Item Despesa (mantendo funcionalidade anterior simples)
  const [novoItem, setNovoItem] = useState('');

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmitFavorecido = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Adiciona o tipo ao objeto antes de enviar
    const dadosParaEnvio = { ...formData, tipo: activeTab };
    
    const res = await saveFavorecidoCompleto(dadosParaEnvio);
    setLoading(false);
    alert(res.message);
    
    if (res.success) {
        // Limpa formulário
        setFormData({
            razaoSocial: '', cnpj: '', rg: '', mei: '',
            endereco: '', complemento: '', bairro: '', cidade: '', uf: '', pais: 'Brasil', codigoPostal: '',
            telefone: '', pessoaContato: '', inscricaoEstadual: '', inscricaoMunicipal: '',
            banco: '', agencia: '', conta: '', chavePix: '', favorecidoBanco: ''
        });
    }
  };

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!novoItem) return;
    const res = await saveItemDespesa(novoItem);
    alert(res.message);
    setNovoItem('');
  }

  return (
    <div className="p-6 max-w-6xl mx-auto pb-20">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Cadastros Auxiliares</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA: CADASTRO DE FAVORECIDO (PRINCIPAL) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 p-4 flex justify-between items-center">
                <h2 className="font-bold text-lg text-slate-700">Novo Favorecido</h2>
                
                {/* BOTÕES DE ABA (PJ / PF) */}
                <div className="flex bg-slate-200 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('PJ')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'PJ' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Building size={16}/> Pessoa Jurídica
                    </button>
                    <button 
                        onClick={() => setActiveTab('PF')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'PF' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <User size={16}/> Pessoa Física
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmitFavorecido} className="p-6 space-y-6">
                
                {/* DADOS GERAIS */}
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><User size={16}/> Dados Principais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="label">{activeTab === 'PJ' ? 'Razão Social *' : 'Nome Completo *'}</label>
                            <input name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} required className="input" placeholder={activeTab === 'PJ' ? 'Nome da Empresa Ltda' : 'Nome da Pessoa'} />
                        </div>
                        
                        <div>
                            <label className="label">{activeTab === 'PJ' ? 'CNPJ *' : 'CPF *'}</label>
                            <input name="cnpj" value={formData.cnpj} onChange={handleChange} required className="input" placeholder={activeTab === 'PJ' ? '00.000.000/0000-00' : '000.000.000-00'} />
                        </div>
                        
                        {/* Campos específicos PF */}
                        {activeTab === 'PF' && (
                            <>
                                <div><label className="label">RG</label><input name="rg" value={formData.rg} onChange={handleChange} className="input" /></div>
                                <div>
                                    <label className="label">Possui MEI?</label>
                                    <select name="mei" value={formData.mei} onChange={handleChange} className="input">
                                        <option value="">Não</option>
                                        <option value="SIM">Sim</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Campos específicos PJ */}
                        {activeTab === 'PJ' && (
                            <>
                                <div><label className="label">Inscrição Estadual</label><input name="inscricaoEstadual" value={formData.inscricaoEstadual} onChange={handleChange} className="input" /></div>
                                <div><label className="label">Inscrição Municipal</label><input name="inscricaoMunicipal" value={formData.inscricaoMunicipal} onChange={handleChange} className="input" /></div>
                                <div><label className="label">Pessoa de Contato</label><input name="pessoaContato" value={formData.pessoaContato} onChange={handleChange} className="input" /></div>
                            </>
                        )}
                        
                        <div><label className="label">Telefone</label><input name="telefone" value={formData.telefone} onChange={handleChange} className="input" /></div>
                    </div>
                </div>

                {/* ENDEREÇO (Igual para os dois) */}
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2 border-t pt-4"><MapPin size={16}/> Endereço</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div className="md:col-span-2"><label className="label">Logradouro</label><input name="endereco" value={formData.endereco} onChange={handleChange} className="input" /></div>
                         <div><label className="label">Complemento</label><input name="complemento" value={formData.complemento} onChange={handleChange} className="input" /></div>
                         <div><label className="label">Bairro</label><input name="bairro" value={formData.bairro} onChange={handleChange} className="input" /></div>
                         <div><label className="label">Cidade</label><input name="cidade" value={formData.cidade} onChange={handleChange} className="input" /></div>
                         <div><label className="label">UF</label><input name="uf" value={formData.uf} onChange={handleChange} className="input w-20" /></div>
                         <div><label className="label">CEP</label><input name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} className="input" /></div>
                         <div><label className="label">País</label><input name="pais" value={formData.pais} onChange={handleChange} className="input" /></div>
                    </div>
                </div>

                {/* DADOS BANCÁRIOS */}
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2 border-t pt-4"><CreditCard size={16}/> Dados Bancários</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div><label className="label">Banco</label><input name="banco" value={formData.banco} onChange={handleChange} className="input" /></div>
                         <div><label className="label">Agência</label><input name="agencia" value={formData.agencia} onChange={handleChange} className="input" /></div>
                         <div><label className="label">Conta</label><input name="conta" value={formData.conta} onChange={handleChange} className="input" /></div>
                         <div className="md:col-span-2"><label className="label">Chave Pix</label><input name="chavePix" value={formData.chavePix} onChange={handleChange} className="input" /></div>
                         {activeTab === 'PF' && (
                             <div className="md:col-span-3"><label className="label">Favorecido (Titular da Conta se diferente)</label><input name="favorecidoBanco" value={formData.favorecidoBanco} onChange={handleChange} className="input" placeholder="Nome do titular da conta" /></div>
                         )}
                    </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2">
                        <Save size={20} /> Salvar {activeTab}
                    </button>
                </div>

            </form>
        </div>

        {/* COLUNA DIREITA: CADASTRO DE ITEM DE DESPESA (SIMPLES) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-fit">
            <div className="border-b border-slate-200 bg-slate-50 p-4">
                <h2 className="font-bold text-lg text-slate-700">Item de Despesa</h2>
                <p className="text-xs text-slate-500">Categorias para contas a pagar</p>
            </div>
            <form onSubmit={handleSubmitItem} className="p-6 space-y-4">
                <div>
                    <label className="label">Nome do Item</label>
                    <input 
                        value={novoItem} 
                        onChange={e => setNovoItem(e.target.value)} 
                        className="input" 
                        placeholder="Ex: COMBUSTÍVEL, ALUGUEL"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-900">
                    Cadastrar Item
                </button>
            </form>
        </div>

      </div>

      <style jsx>{`
        .label { display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem; font-weight: 700; text-transform: uppercase; }
        .input { width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.375rem; outline: none; transition: all; font-size: 0.875rem; }
        .input:focus { border-color: #3b82f6; ring: 2px; ring-color: #3b82f6; }
      `}</style>
    </div>
  );
}