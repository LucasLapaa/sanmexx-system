import Link from 'next/link';
import { Truck, DollarSign, Users } from 'lucide-react';

export default function DashboardHome() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Bem-vindo ao SANMEXX OS</h1>
        <p className="text-slate-500">Selecione um módulo para começar a operar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card Financeiro */}
        <Link href="/dashboard/financeiro" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer h-full">
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
              <DollarSign className="w-8 h-8 text-blue-600 group-hover:text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Financeiro</h2>
            <p className="text-sm text-slate-500">
              Verifique lucros, faturamento e emita relatórios de desempenho.
            </p>
          </div>
        </Link>

        {/* Card Motoristas */}
        <Link href="/dashboard/motoristas" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-green-200 transition-all cursor-pointer h-full">
            <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
              <Truck className="w-8 h-8 text-green-600 group-hover:text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Motoristas & Frota</h2>
            <p className="text-sm text-slate-500">
              Cadastre motoristas, gerencie veículos e contratos de frete.
            </p>
          </div>
        </Link>

        {/* Card Clientes */}
        <Link href="/dashboard/clientes" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-purple-200 transition-all cursor-pointer h-full">
            <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
              <Users className="w-8 h-8 text-purple-600 group-hover:text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Clientes</h2>
            <p className="text-sm text-slate-500">
              Base de clientes, tabelas de frete e histórico de pedidos.
            </p>
          </div>
        </Link>

        {/* Card Clientes */}
        <Link href="/dashboard/operacional" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-purple-200 transition-all cursor-pointer h-full">
            <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
              <Users className="w-8 h-8 text-purple-600 group-hover:text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Operacional</h2>
            <p className="text-sm text-slate-500">
              Operacional.
            </p>
          </div>
        </Link>

      </div>
    </div>
  );
}