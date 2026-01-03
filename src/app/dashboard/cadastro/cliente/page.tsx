'use client';

import { useState, useEffect } from 'react';
import { Save, X, Building2, MapPin, FileText, Loader2 } from 'lucide-react';
// Importamos a função que salva no banco
import { saveCliente } from '@/app/actions/saveCliente';

export default function CadastroClientePage() {
  const [loading, setLoading] = useState(false); // Estado de carregamento

  const [formData, setFormData] = useState({
    codigo: '',
    razaoSocial: '',
    cnpj: '',
    planta: '',
    endereco: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    pais: 'Brasil',
    codigoPostal: '',
    telefone: '',
    pessoaContato: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    isFornecedor: false,
  });

  // Lógica do Código Automático
  useEffect(() => {
    const { razaoSocial, cnpj, planta, codigo } = formData;
    if (razaoSocial && cnpj && planta && !codigo) {
      const novoCodigo = Math.floor(10000 + Math.random() * 90000).toString();
      setFormData(prev => ({ ...prev, codigo: novoCodigo }));
    }
  }, [formData.razaoSocial, formData.cnpj, formData.planta]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isFornecedor: e.target.checked }));
  };

  // --- FUNÇÃO DE SALVAR ATUALIZADA ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Chama a função do servidor
    const result = await saveCliente(formData);

    setLoading(false);

    if (result.success) {
      alert(result.message);
      // Limpa o formulário ou redireciona se quiser
      setFormData({
        codigo: '', razaoSocial: '', cnpj: '', planta: '', endereco: '', complemento: '',
        bairro: '', cidade: '', uf: '', pais: 'Brasil', codigoPostal: '', telefone: '',
        pessoaContato: '', inscricaoEstadual: '', inscricaoMunicipal: '', isFornecedor: false,
      });
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Novo Cliente</h1>
          <p className="text-slate-500">Cadastro integrado ao Banco de Dados</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => window.history.back()} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <X size={20} />
            Cancelar
          </button>
          
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {loading ? 'Salvando...' : 'Salvar Cadastro'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BLOCO 1: DADOS PRINCIPAIS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6 text-blue-800 pb-2 border-b border-blue-100">
            <Building2 size={20} />
            <h2 className="font-bold text-lg">Dados Empresariais</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ *</label>
              <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="00.000.000/0000-00" />
            </div>

            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-slate-700 mb-1">Razão Social *</label>
              <input type="text" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Planta *</label>
              <input type="text" name="planta" value={formData.planta} onChange={handleChange} required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-blue-800 mb-1">CÓDIGO (Auto) *</label>
              <input type="text" name="codigo" value={formData.codigo} readOnly
                className="w-full px-4 py-2 bg-blue-50 border border-blue-200 text-blue-800 font-bold rounded-lg cursor-not-allowed" />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Inscrição Estadual</label>
              <input type="text" name="inscricaoEstadual" value={formData.inscricaoEstadual} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Inscrição Municipal</label>
              <input type="text" name="inscricaoMunicipal" value={formData.inscricaoMunicipal} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        {/* BLOCO 2: ENDEREÇO E CONTATO */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6 text-blue-800 pb-2 border-b border-blue-100">
            <MapPin size={20} />
            <h2 className="font-bold text-lg">Localização e Contato</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
              <input type="text" name="telefone" value={formData.telefone} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Pessoa de Contato</label>
              <input type="text" name="pessoaContato" value={formData.pessoaContato} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">CEP</label>
              <input type="text" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
             <div className="md:col-span-3"></div>

            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
              <input type="text" name="endereco" value={formData.endereco} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Complemento</label>
              <input type="text" name="complemento" value={formData.complemento} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Bairro</label>
              <input type="text" name="bairro" value={formData.bairro} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
              <input type="text" name="cidade" value={formData.cidade} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">UF</label>
              <input type="text" name="uf" value={formData.uf} maxLength={2} placeholder="SP" onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">País</label>
              <input type="text" name="pais" value={formData.pais} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        {/* BLOCO 3: VÍNCULO AUTOMÁTICO */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
               <FileText size={24} />
            </div>
            <div>
               <h3 className="font-bold text-slate-800">Vínculos Automáticos</h3>
               <p className="text-sm text-slate-500 mb-4">Selecione para duplicar este cadastro.</p>
               
               <label className="flex items-center gap-3 cursor-pointer group">
                 <input type="checkbox" checked={formData.isFornecedor} onChange={handleCheckbox}
                   className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                 <span className="font-semibold text-slate-700 group-hover:text-blue-700">
                   Cadastrar também como Fornecedor
                 </span>
               </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}