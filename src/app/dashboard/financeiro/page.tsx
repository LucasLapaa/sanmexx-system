'use client';
import FinanceChart from '../../../components/FinanceChart';

export default function FinancePage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Controle Financeiro</h1>
        <div className="space-x-2">
          <select className="p-2 border rounded-md bg-white">
            <option>2025</option>
            <option>2024</option>
          </select>
          <select className="p-2 border rounded-md bg-white">
            <option>Todos os Clientes</option>
            <option>Longping High - Tech</option>
            <option>Ams Log</option>
          </select>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-600 p-6 rounded-xl text-white shadow-lg">
          <p className="text-sm opacity-80">Faturamento Total</p>
          <h2 className="text-3xl font-bold">R$ 150.743,35</h2>
          <p className="text-xs mt-2">Ref. Memória de Cálculo</p>
        </div>
        <div className="bg-green-500 p-6 rounded-xl text-white shadow-lg">
          <p className="text-sm opacity-80">Lucro Líquido</p>
          <h2 className="text-3xl font-bold">R$ 45.200,00</h2>
          <p className="text-xs mt-2">Margem atual: 30%</p>
        </div>
        <div className="bg-red-500 p-6 rounded-xl text-white shadow-lg">
          <p className="text-sm opacity-80">Custos Operacionais</p>
          <h2 className="text-3xl font-bold">R$ 1.936,65</h2>
          <p className="text-xs mt-2">Baseado na Tabela de Custos</p>
        </div>
        <div className="bg-purple-600 p-6 rounded-xl text-white shadow-lg">
          <p className="text-sm opacity-80">CTEs Emitidos</p>
          <h2 className="text-3xl font-bold">18</h2>
          <p className="text-xs mt-2">Neste mês</p>
        </div>
      </div>

      {/* Gráfico */}
      <FinanceChart />
    </div>
  );
}