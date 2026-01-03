'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, Trash2 } from 'lucide-react'; // Importei Trash2 (Lixeira)

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ razaoSocial: '', cnpj: '', telefone: '', cidade: '' });

  // 1. Carrega os dados
  useEffect(() => {
    carregarDados();
  }, []);

  function carregarDados() {
    setLoading(true);
    fetch('/api/fornecedores')
      .then(r => r.json())
      .then(data => {
        setFornecedores(data);
        setLoading(false);
      });
  }

  // 2. Salva novo fornecedor
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/fornecedores', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    setShowModal(false);
    setFormData({ razaoSocial: '', cnpj: '', telefone: '', cidade: '' }); // Limpa form
    carregarDados(); // Recarrega a lista
  }

  // 3. Função de Excluir (NOVO)
  async function handleDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
      await fetch(`/api/fornecedores?id=${id}`, { method: 'DELETE' });
      carregarDados(); // Recarrega a lista sem precisar dar F5
    }
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
              <th className="p-4 w-20 text-center">Ações</th> {/* Nova Coluna */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center">Carregando...</td></tr>
            ) : fornecedores.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">Nenhum fornecedor cadastrado.</td></tr>
            ) : (
              fornecedores.map((f: any) => (
                <tr key={f.id} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium">{f.razaoSocial}</td>
                  <td className="p-4">{f.cnpj}</td>
                  <td className="p-4">{f.telefone}</td>
                  <td className="p-4">{f.cidade}</td>
                  
                  {/* Botão de Excluir */}
                  <td className="p-4 text-center">
                    <button 
                        onClick={() => handleDelete(f.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all"
                        title="Excluir Fornecedor"
                    >
                        <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DE CADASTRO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Novo Fornecedor</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input 
                placeholder="Razão Social" 
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                value={formData.razaoSocial}
                onChange={e => setFormData({...formData, razaoSocial: e.target.value})} 
                required 
              />
              <input 
                placeholder="CNPJ" 
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                value={formData.cnpj}
                onChange={e => setFormData({...formData, cnpj: e.target.value})} 
                required 
              />
              <input 
                placeholder="Telefone" 
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                value={formData.telefone}
                onChange={e => setFormData({...formData, telefone: e.target.value})} 
              />
              <input 
                placeholder="Cidade" 
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                value={formData.cidade}
                onChange={e => setFormData({...formData, cidade: e.target.value})} 
              />
              
              <div className="flex gap-2 mt-4 pt-2 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}