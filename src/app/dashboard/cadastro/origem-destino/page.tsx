'use client';

import { useState } from 'react';
import { Save, X, MapPin, Loader2 } from 'lucide-react';
import { saveOrigemDestino } from '@/app/actions/saveOrigemDestino';

export default function CadastroOrigemDestinoPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cidade: '',
    estado: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Se for estado, força maiúsculo e limita a 2 letras
    if (name === 'estado') {
        setFormData(prev => ({ ...prev, [name]: value.toUpperCase().slice(0, 2) }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await saveOrigemDestino(formData);

    setLoading(false);
    if (result.success) {
      alert(result.message);
      setFormData({ cidade: '', estado: '' });
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-10 pt-10">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Origem / Destino</h1>
          <p className="text-slate-500">Cadastro de rotas e localidades</p>
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
            <MapPin size={20} />
            <h2 className="font-bold text-lg">Dados da Localidade</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* CIDADE */}
            <div className="md:col-span-9">
              <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
              <input 
                type="text" 
                name="cidade" 
                value={formData.cidade} 
                onChange={handleChange} 
                required
                placeholder="Ex: Santos"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              />
            </div>

            {/* ESTADO (UF) */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado (UF)</label>
              <input 
                type="text" 
                name="estado" 
                value={formData.estado} 
                onChange={handleChange} 
                required
                placeholder="SP"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center font-bold" 
              />
            </div>

          </div>

      </form>
    </div>
  );
}