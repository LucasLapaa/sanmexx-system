'use client';
import { useState } from 'react';

export default function DriversPage() {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    vehiclePlate: '',
    trailerPlate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Motorista cadastrado com sucesso!');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cadastro de Motoristas e Veículos</h1>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="col-span-2">
            <h2 className="text-lg font-semibold text-blue-900 border-b pb-2 mb-4">Dados do Motorista</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input 
              type="text"
              placeholder="Ex: Tiago da Silva Farias" 
              className="mt-1 block w-full p-2 border rounded-md"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CPF</label>
            <input 
              type="text"
              placeholder="000.000.000-00" 
              className="mt-1 block w-full p-2 border rounded-md"
              onChange={(e) => setFormData({...formData, cpf: e.target.value})}
            />
          </div>

          <div className="col-span-2 mt-4">
            <h2 className="text-lg font-semibold text-blue-900 border-b pb-2 mb-4">Dados do Veículo</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Placa Cavalo</label>
            <input 
              type="text"
              placeholder="AAA-0000" 
              className="mt-1 block w-full p-2 border rounded-md uppercase"
              onChange={(e) => setFormData({...formData, vehiclePlate: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Placa Reboque</label>
            <input 
              type="text"
              placeholder="AAA-0000" 
              className="mt-1 block w-full p-2 border rounded-md uppercase"
              onChange={(e) => setFormData({...formData, trailerPlate: e.target.value})}
            />
          </div>

          <div className="col-span-2 flex justify-end mt-4">
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
              Salvar Cadastro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}