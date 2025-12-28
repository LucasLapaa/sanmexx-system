'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function NovoClientePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '', cnpj: '', cidade: '', estado: 'SP'
  });

  async function handleSave() {
    const res = await fetch('/api/clientes', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    
    if (res.ok) {
      alert('Cliente Salvo!');
      router.push('/dashboard/clientes');
    } else {
      alert('Erro ao salvar. Verifique se rodou "npx prisma generate"');
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
           <Link href="/dashboard/clientes">
             <ArrowLeft className="cursor-pointer text-gray-500"/>
           </Link>
           <h1 className="text-2xl font-bold">Novo Cliente</h1>
        </div>
        
        <div className="space-y-4">
          <input 
            placeholder="Nome da Empresa" 
            className="w-full border p-2 rounded"
            onChange={e => setFormData({...formData, nome: e.target.value})}
          />
          <input 
            placeholder="CNPJ" 
            className="w-full border p-2 rounded"
            onChange={e => setFormData({...formData, cnpj: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              placeholder="Cidade" 
              className="w-full border p-2 rounded"
              onChange={e => setFormData({...formData, cidade: e.target.value})}
            />
            <input 
              placeholder="Estado (UF)" 
              className="w-full border p-2 rounded"
              onChange={e => setFormData({...formData, estado: e.target.value})}
            />
          </div>
          
          <button 
            onClick={handleSave}
            className="w-full bg-blue-900 text-white font-bold py-3 rounded mt-4 hover:bg-blue-800"
          >
            <Save className="inline mr-2" size={18}/> Salvar Cliente
          </button>
        </div>
      </div>
    </div>
  );
}