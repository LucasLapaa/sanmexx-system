'use client';

import { useState, useEffect } from 'react';
import { Truck, Plus } from 'lucide-react';

export default function VeiculosPage() {
  const [veiculos, setVeiculos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ 
    placaCavalo: '', tipoVeiculo: 'Carreta', modelo: '', cor: '', tara: '', tamanho: '', motNome: '' 
  });

  useEffect(() => {
    fetch('/api/veiculos').then(r => r.json()).then(setVeiculos);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/veiculos', { method: 'POST', body: JSON.stringify(form) });
    window.location.reload();
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Truck /> Frota & Veículos
        </h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={20} /> Novo Veículo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {veiculos.map((v: any) => (
          <div key={v.id} className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-xl">{v.placaCavalo}</h3>
                <p className="text-gray-500">{v.modelo} - {v.cor}</p>
              </div>
              <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{v.tipoVeiculo}</span>
            </div>
            <div className="mt-4 pt-4 border-t text-sm text-gray-600">
              <p><strong>Motorista:</strong> {v.motNome}</p>
              <p><strong>Tamanho:</strong> {v.tamanho}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Adicionar Veículo</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Placa Cavalo (Ex: ABC-1234)" className="w-full border p-2 rounded" 
                onChange={e => setForm({...form, placaCavalo: e.target.value})} required />
              <select className="w-full border p-2 rounded" onChange={e => setForm({...form, tipoVeiculo: e.target.value})}>
                <option value="Carreta">Carreta</option>
                <option value="Truck">Truck</option>
                <option value="Toco">Toco</option>
                <option value="VLC">VLC</option>
              </select>
              <input placeholder="Modelo (Ex: Scania R450)" className="w-full border p-2 rounded" 
                onChange={e => setForm({...form, modelo: e.target.value})} required />
              <input placeholder="Cor" className="w-full border p-2 rounded" 
                onChange={e => setForm({...form, cor: e.target.value})} required />
              <div className="flex gap-2">
                <input placeholder="Tara" className="w-1/2 border p-2 rounded" 
                    onChange={e => setForm({...form, tara: e.target.value})} required />
                <input placeholder="Tamanho" className="w-1/2 border p-2 rounded" 
                    onChange={e => setForm({...form, tamanho: e.target.value})} required />
              </div>
              
              <div className="border-t pt-2 mt-2">
                <p className="text-xs font-bold mb-2">Motorista Principal</p>
                <input placeholder="Nome do Motorista" className="w-full border p-2 rounded" 
                    onChange={e => setForm({...form, motNome: e.target.value})} required />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded mt-4">Salvar Veículo</button>
              <button type="button" onClick={() => setShowModal(false)} className="w-full mt-2 text-gray-500">Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}