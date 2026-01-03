'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, Search } from 'lucide-react';

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ razaoSocial: '', cnpj: '', telefone: '', cidade: '' });

  useEffect(() => {
    fetch('/api/fornecedores').then(r => r.json()).then(data => {
      setFornecedores(data);
      setLoading(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/fornecedores', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    setShowModal(false);
    window.location.reload();
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Building2 /> Fornecedores
        </h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} /> Novo Fornecedor
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-4">Razão Social</th>
              <th className="p-4">CNPJ</th>
              <th className="p-4">Telefone</th>
              <th className="p-4">Cidade</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td className="p-4">Carregando...</td></tr> : fornecedores.map((f: any) => (
              <tr key={f.id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-medium">{f.razaoSocial}</td>
                <td className="p-4">{f.cnpj}</td>
                <td className="p-4">{f.telefone}</td>
                <td className="p-4">{f.cidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL SIMPLES */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Novo Fornecedor</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Razão Social" className="w-full border p-2 rounded" 
                onChange={e => setFormData({...formData, razaoSocial: e.target.value})} required />
              <input placeholder="CNPJ" className="w-full border p-2 rounded" 
                onChange={e => setFormData({...formData, cnpj: e.target.value})} required />
              <input placeholder="Telefone" className="w-full border p-2 rounded" 
                onChange={e => setFormData({...formData, telefone: e.target.value})} />
              <input placeholder="Cidade" className="w-full border p-2 rounded" 
                onChange={e => setFormData({...formData, cidade: e.target.value})} />
              
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 p-2 rounded">Cancelar</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}