'use client';

import { useState } from 'react';
import { Save, X, Ship, Loader2 } from 'lucide-react';
import { saveNavio } from '@/app/actions/saveNavio';

export default function CadastroNavioPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await saveNavio(formData);

    setLoading(false);
    
    if (result.success) {
      alert(result.message);
      // Limpa o campo input após salvar
      (e.target as HTMLFormElement).reset();
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-10 pt-10">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Novo Navio</h1>
          <p className="text-slate-500">Cadastro de embarcações</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => window.history.back()} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <X size={20} />
            Cancelar
          </button>
          
          {/* Botão de Submit direto no form via id ou htmlType="submit" dentro do form */}
          <button 
            type="submit"
            form="form-navio"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Salvar
          </button>
        </div>
      </div>

      <form id="form-navio" onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          
          <div className="flex items-center gap-2 mb-6 text-blue-800 pb-2 border-b border-blue-100">
            <Ship size={24} />
            <h2 className="font-bold text-lg">Dados da Embarcação</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nome do Navio</label>
            <div className="relative">
               <Ship className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
               <input 
                  type="text" 
                  name="nome" 
                  required
                  placeholder="Ex: MAERSK LETA"
                  className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg uppercase" 
               />
            </div>
            <p className="text-sm text-slate-400 mt-2 ml-1">Digite o nome completo da embarcação.</p>
          </div>

      </form>
    </div>
  );
}