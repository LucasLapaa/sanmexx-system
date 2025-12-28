'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Estado inicial do formulário
  const [formData, setFormData] = useState({
    processNumber: '',
    sanmexxRef: '',
    clientRef: '',
    clientName: '',
    driverName: '',
    origin: '',
    destination: '',
    pickupDate: '',
    booking: '',
    ship: '',
    terminal: '',
    containerNum: '',
    containerType: '40 HC',
    seal: '',
    tare: '',
    freightValue: 0,
    tollValue: 0,
    extraValue: 0,
    totalValue: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert('Ordem de Coleta criada com sucesso!');
      router.push('/dashboard/operacional');
    } else {
      alert('Erro ao salvar.');
    }
    setLoading(false);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/operacional" className="p-2 bg-white rounded-full shadow hover:bg-slate-100">
          <ArrowLeft className="text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Nova Ordem de Coleta</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
        
        {/* Bloco 1: Identificação */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">Identificação do Processo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Nº Processo</label>
              <input name="processNumber" onChange={handleChange} placeholder="Ex: 00008/25" className="w-full p-2 border rounded-md" required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Ref. Sanmexx</label>
              <input name="sanmexxRef" onChange={handleChange} placeholder="Ex: TR-00004/25" className="w-full p-2 border rounded-md" required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Ref. Cliente</label>
              <input name="clientRef" onChange={handleChange} placeholder="Ex: SSZ..." className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Cliente (Nome)</label>
              <input name="clientName" onChange={handleChange} placeholder="Ex: Longping High - Tech" className="w-full p-2 border rounded-md" required />
            </div>
            <div className="md:col-span-2">
               <label className="text-sm font-medium text-slate-700">Motorista (Nome)</label>
              <input name="driverName" onChange={handleChange} placeholder="Ex: Ramon Luis..." className="w-full p-2 border rounded-md" required />
            </div>
          </div>
        </div>

        {/* Bloco 2: Logística e Dados Marítimos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">Dados Logísticos e Marítimos</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Origem (Coleta)</label>
              <input name="origin" onChange={handleChange} className="w-full p-2 border rounded-md" required />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Destino (Entrega)</label>
              <input name="destination" onChange={handleChange} className="w-full p-2 border rounded-md" required />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700">Data Coleta</label>
              <input name="pickupDate" type="datetime-local" onChange={handleChange} className="w-full p-2 border rounded-md" required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Navio</label>
              <input name="ship" onChange={handleChange} placeholder="Ex: MSC ELLEN" className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Booking / DI</label>
              <input name="booking" onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
               <label className="text-sm font-medium text-slate-700">Terminal</label>
              <input name="terminal" onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>

            {/* Container Info */}
            <div>
               <label className="text-sm font-medium text-slate-700">Nº Container</label>
              <input name="containerNum" onChange={handleChange} className="w-full p-2 border rounded-md uppercase" />
            </div>
             <div>
               <label className="text-sm font-medium text-slate-700">Tipo</label>
               <select name="containerType" onChange={handleChange} className="w-full p-2 border rounded-md">
                 <option>40 HC</option>
                 <option>20 DC</option>
                 <option>40 DC</option>
               </select>
            </div>
            <div>
               <label className="text-sm font-medium text-slate-700">Lacre</label>
              <input name="seal" onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
             <div>
               <label className="text-sm font-medium text-slate-700">Tara</label>
              <input name="tare" onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
          </div>
        </div>

        {/* Bloco 3: Financeiro */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h2 className="text-lg font-bold text-green-700 mb-4 border-b pb-2">Financeiro da Operação</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Frete Peso (R$)</label>
                <input name="freightValue" type="number" step="0.01" onChange={handleChange} className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Pedágio (R$)</label>
                <input name="tollValue" type="number" step="0.01" onChange={handleChange} className="w-full p-2 border rounded-md" />
              </div>
               <div>
                <label className="text-sm font-medium text-slate-700">Outros/Extras (R$)</label>
                <input name="extraValue" type="number" step="0.01" onChange={handleChange} className="w-full p-2 border rounded-md" />
              </div>
               <div>
                <label className="text-sm font-medium text-slate-700 font-bold">Valor Total (R$)</label>
                <input name="totalValue" type="number" step="0.01" onChange={handleChange} className="w-full p-2 border border-blue-200 bg-blue-50 rounded-md font-bold text-blue-900" />
              </div>
           </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2 shadow-lg"
          >
            <Save size={20} />
            {loading ? 'Salvando...' : 'Salvar Ordem de Coleta'}
          </button>
        </div>

      </form>
    </div>
  );
}