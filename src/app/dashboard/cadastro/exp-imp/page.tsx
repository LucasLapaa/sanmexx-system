'use client';

import { useState, useEffect } from 'react';
import { Save, X, Truck, MapPin, DollarSign, User, Loader2 } from 'lucide-react';
import { saveParceiro } from '@/app/actions/saveParceiro';

export default function CadastroAgenteCargasPage() {
  const [loading, setLoading] = useState(false);
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    codigo: '',
    razaoSocial: '',
    cnpj: '',
    planta: '',
    endereco: '',
    complemento: '',
    bairro: '',
    cidade: '',
    codigoPostal: '',
    uf: '',
    pais: 'Brasil',
    telefone: '',
    pessoaContato: '', // Novo campo
    isFavorecido: false,
  });

  // --- LÓGICA DO CÓDIGO AUTOMÁTICO ---
  // Só gera se tiver: Razão Social, CNPJ e Planta
  useEffect(() => {
    const { razaoSocial, cnpj, planta, codigo } = formData;
    if (razaoSocial && cnpj && planta && !codigo) {
      const novoCodigo = Math.floor(10000 + Math.random() * 90000).toString();
      setFormData(prev => ({ ...prev, codigo: novoCodigo }));
    }
  }, [formData.razaoSocial, formData.cnpj, formData.planta]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isFavorecido: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // --- AQUI VOCÊ MUDA O TIPO DEPENDENDO DA PÁGINA ---
    // Opções: 'agente_cargas' | 'terminal' | 'depot' | 'armador'
    const result = await saveParceiro({
        ...formData,
        tipo: 'exportador' 
    });

    setLoading(false);
    if (result.success) {
      alert(result.message);
      // Limpa formulário (reset)
      setFormData({
        codigo: '', razaoSocial: '', cnpj: '', planta: '', endereco: '', complemento: '',
        bairro: '', cidade: '', codigoPostal: '', uf: '', pais: 'Brasil', telefone: '',
        pessoaContato: '', isFavorecido: false
      });
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Novo Agente de Cargas</h1>
          <p className="text-slate-500">Cadastro de parceiro logístico</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => window.history.back()} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">
            <X size={20} /> Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            Salvar
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* DADOS PRINCIPAIS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6 text-blue-800 pb-2 border-b border-blue-100">
            <Truck size={20} />
            <h2 className="font-bold text-lg">Dados Empresariais</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ *</label>
              <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="00.000.000/0000-00" />
            </div>
            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-slate-700 mb-1">Razão Social *</label>
              <input type="text" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Planta *</label>
              <input type="text" name="planta" value={formData.planta} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Unidade..." />
            </div>
            
            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-blue-800 mb-1">CÓDIGO (Auto) *</label>
              <input type="text" name="codigo" value={formData.codigo} readOnly className="w-full px-4 py-2 bg-blue-50 border border-blue-200 text-blue-800 font-bold rounded-lg cursor-not-allowed" />
            </div>
            
            <div className="md:col-span-4">
               <label className="block text-sm font-medium text-slate-700 mb-1">Pessoa de Contato</label>
               <div className="relative">
                 <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input type="text" name="pessoaContato" value={formData.pessoaContato} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nome do responsável" />
               </div>
            </div>
            
            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
              <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* ENDEREÇO */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6 text-blue-800 pb-2 border-b border-blue-100">
            <MapPin size={20} />
            <h2 className="font-bold text-lg">Localização</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">CEP</label>
              <input type="text" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
              <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Complemento</label>
              <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Bairro</label>
              <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
              <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">UF</label>
              <input type="text" name="uf" value={formData.uf} maxLength={2} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 uppercase" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">País</label>
              <input type="text" name="pais" value={formData.pais} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* INTEGRAÇÃO FINANCEIRO */}
        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600">
               <DollarSign size={24} />
            </div>
            <div>
               <h3 className="font-bold text-slate-800">Financeiro</h3>
               <p className="text-sm text-slate-500 mb-4">Migrar este cadastro automaticamente para contas a pagar?</p>
               
               <label className="flex items-center gap-3 cursor-pointer group">
                 <input type="checkbox" checked={formData.isFavorecido} onChange={handleCheckbox} className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                 <span className="font-semibold text-slate-700 group-hover:text-emerald-700">
                   Cadastrar como FORNECEDOR (Favorecido)
                 </span>
               </label>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}