'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Jan', receita: 15000, custo: 8000, lucro: 7000 },
  { name: 'Fev', receita: 18000, custo: 8500, lucro: 9500 },
  { name: 'Mar', receita: 10635, custo: 6090, lucro: 4545 },
  { name: 'Abr', receita: 22000, custo: 10000, lucro: 12000 },
];

export default function FinanceChart() {
  return (
    <div className="h-[400px] w-full bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-bold mb-4 text-gray-700">Performance Financeira Anual</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="receita" fill="#1e3a8a" name="Faturamento" />
          <Bar dataKey="custo" fill="#ef4444" name="Custos" />
          <Bar dataKey="lucro" fill="#22c55e" name="Lucro Líquido" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}