'use client';

import { useState } from 'react';
import { Save, X, Anchor, Globe, Loader2 } from 'lucide-react';
import { savePorto } from '@/app/actions/savePorto';

export default function CadastroPortoPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    pais: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await savePorto(formData);

    setLoading(false);
    if (result.success) {
      alert(result.message);
      setFormData({ nome: '', pais: '' }); // Limpa o formulário
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-10 pt-10">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Novo Porto</h1>
          <p className="text-slate-500">Cadastro de portos e terminais marítimos</p>
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
            Salvar
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          
          <div className="flex items-center gap-2 mb-6 text-blue-800 pb-2 border-b border-blue-100">
            <Anchor size={20} />
            <h2 className="font-bold text-lg">Informações do Porto</h2>
          </div>

          <div className="space-y-6">
            {/* Campo PORTO */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Porto</label>
              <div className="relative">
                 <Anchor className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                    type="text" 
                    name="nome" 
                    value={formData.nome} 
                    onChange={handleChange} 
                    required
                    placeholder="Ex: Porto de Santos"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                 />
              </div>
            </div>

            {/* Campo PAÍS */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">País</label>
              <div className="relative">
                 <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                    type="text" 
                    name="pais" 
                    value={formData.pais} 
                    onChange={handleChange} 
                    required
                    placeholder="Ex: Brasil"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                 />
              </div>
            </div>
          </div>

      </form>
    </div>
  );
}