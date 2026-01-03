'use client';

import { useState, useEffect } from 'react';
import { Save, X, Truck, User, Key, Copy, Loader2 } from 'lucide-react';
import { saveVeiculo } from '@/app/actions/saveVeiculo';

export default function CadastroVeiculoPage() {
  const [loading, setLoading] = useState(false);
  const [proprietarioMotorista, setProprietarioMotorista] = useState(false);

  const [formData, setFormData] = useState({
    // Proprietário
    propNome: '',
    propCNH: '',
    propVencimento: '',
    propCPF: '',
    propRG: '',
    propTelefone: '',

    // Veículo
    tipoVeiculo: 'Cavalo Mecânico',
    placaCavalo: '',
    placaCarreta: '',
    modelo: '',
    cor: '',
    tara: '',
    tamanho: '',
    chassiCavalo: '',
    renavamCavalo: '',
    chassiCarreta: '',
    renavamCarreta: '',

    // Motorista
    motNome: '',
    motTelefone: '',
    motCPF: '',
    motRG: '',
    motCNH: '',
    motVencimento: '',
  });

  // --- LÓGICA AUTOMÁTICA: Copiar Proprietário para Motorista ---
  useEffect(() => {
    if (proprietarioMotorista) {
      setFormData(prev => ({
        ...prev,
        motNome: prev.propNome,
        motTelefone: prev.propTelefone,
        motCPF: prev.propCPF,
        motRG: prev.propRG,
        motCNH: prev.propCNH,
        motVencimento: prev.propVencimento
      }));
    }
  }, [
    proprietarioMotorista, 
    formData.propNome, formData.propTelefone, formData.propCPF, 
    formData.propRG, formData.propCNH, formData.propVencimento
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- FUNÇÃO DUPLICAR PARA FROTA ---
  // Mantém o dono e motorista, limpa só o veículo
  const handleDuplicar = () => {
    if(confirm('Deseja cadastrar outro veículo para este mesmo proprietário?')) {
        setFormData(prev => ({
            ...prev,
            // Limpa dados do veículo
            placaCavalo: '', placaCarreta: '', modelo: '', cor: '', 
            tara: '', tamanho: '', chassiCavalo: '', renavamCavalo: '', 
            chassiCarreta: '', renavamCarreta: '',
            // Mantém Proprietário e Motorista intactos
        }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
        alert('Dados do veículo limpos. Preencha o novo caminhão e clique em Salvar novamente.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await saveVeiculo(formData);
    setLoading(false);

    if (result.success) {
      alert(result.message);
      // Opcional: Limpar tudo ou perguntar se quer duplicar
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Novo Veículo e Motorista</h1>
          <p className="text-slate-500">Gerenciamento de frota e condutores</p>
        </div>
        <div className="flex gap-3">
            {/* BOTÃO DUPLICAR */}
            <button 
                type="button"
                onClick={handleDuplicar}
                className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-200 transition-colors"
                title="Mantém o dono e limpa o veículo para cadastrar outro"
            >
                <Copy size={18} />
                Duplicar Dono
            </button>

            <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md">
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                Salvar
            </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* --- 1. PROPRIETÁRIO --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6 text-blue-800 pb-2 border-b border-blue-100">
            <User size={20} />
            <h2 className="font-bold text-lg">Dados do Proprietário</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
             <div className="md:col-span-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input type="text" name="propNome" value={formData.propNome} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">CPF</label>
                <input type="text" name="propCPF" value={formData.propCPF} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">RG</label>
                <input type="text" name="propRG" value={formData.propRG} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             
             <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">CNH</label>
                <input type="text" name="propCNH" value={formData.propCNH} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Vencimento CNH</label>
                <input type="date" name="propVencimento" value={formData.propVencimento} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             <div className="md:col-span-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                <input type="text" name="propTelefone" value={formData.propTelefone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
          </div>
        </div>

        {/* --- 2. DADOS DO VEÍCULO --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6 text-blue-800 pb-2 border-b border-blue-100">
            <Truck size={20} />
            <h2 className="font-bold text-lg">Dados do Veículo</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Veículo</label>
                <select name="tipoVeiculo" value={formData.tipoVeiculo} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="Cavalo Mecânico">Cavalo Mecânico</option>
                    <option value="Truck">Truck</option>
                </select>
            </div>
            
            <div className="md:col-span-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Placa Cavalo</label>
                <input type="text" name="placaCavalo" value={formData.placaCavalo} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 uppercase" placeholder="ABC-1234" />
            </div>
            <div className="md:col-span-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Placa Carreta</label>
                <input type="text" name="placaCarreta" value={formData.placaCarreta} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 uppercase" />
            </div>

            <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Modelo</label>
                <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Cor</label>
                <input type="text" name="cor" value={formData.cor} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Tara</label>
                <input type="text" name="tara" value={formData.tara} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Tamanho</label>
                <input type="text" name="tamanho" value={formData.tamanho} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Chassi Cavalo</label>
                <input type="text" name="chassiCavalo" value={formData.chassiCavalo} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Renavam Cavalo</label>
                <input type="text" name="renavamCavalo" value={formData.renavamCavalo} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Chassi Carreta</label>
                <input type="text" name="chassiCarreta" value={formData.chassiCarreta} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Renavam Carreta</label>
                <input type="text" name="renavamCarreta" value={formData.renavamCarreta} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* --- 3. MOTORISTA --- */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2 text-slate-800">
                <Key size={20} />
                <h2 className="font-bold text-lg">Dados do Motorista</h2>
            </div>
            
            {/* CHECKBOX MÁGICO */}
            <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded border border-slate-300 hover:border-blue-400 transition-colors">
                <input 
                    type="checkbox" 
                    checked={proprietarioMotorista} 
                    onChange={(e) => setProprietarioMotorista(e.target.checked)} 
                    className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-slate-700 select-none">Proprietário é o Motorista? (Sim)</span>
            </label>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 transition-opacity duration-300 ${proprietarioMotorista ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
             <div className="md:col-span-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input type="text" name="motNome" value={formData.motNome} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">CPF</label>
                <input type="text" name="motCPF" value={formData.motCPF} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">RG</label>
                <input type="text" name="motRG" value={formData.motRG} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
             </div>

             <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">CNH</label>
                <input type="text" name="motCNH" value={formData.motCNH} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Vencimento CNH</label>
                <input type="date" name="motVencimento" value={formData.motVencimento} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             <div className="md:col-span-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                <input type="text" name="motTelefone" value={formData.motTelefone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
          </div>
          {proprietarioMotorista && <p className="text-xs text-blue-600 mt-2 text-center">* Dados copiados automaticamente do proprietário.</p>}
        </div>

      </form>
    </div>
  );
}