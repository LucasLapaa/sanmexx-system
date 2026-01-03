'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Truck, 
  DollarSign, 
  Map as MapIcon,
  Anchor,       // Para Processos
  Printer,      // Para Documentos
  PieChart,     // Para Relatórios
  CreditCard,   // Para Contas a Pagar
  Wallet,       // Para Contas a Receber
  FilePlus      // Para Solicitação
} from 'lucide-react';

const menuItems = [
  // --- GERAL ---
  { name: 'Visão Geral', icon: LayoutDashboard, path: '/dashboard' },
  
  // --- OPERACIONAL ---
  // Atualizado para a pasta "processos" que criamos
  { name: 'Processos (Operacional)', icon: Anchor, path: '/dashboard/processos' },
  // Novo módulo de Documentos
  { name: 'Emissão de Docs', icon: Printer, path: '/dashboard/documentos' },
  
  // --- FINANCEIRO (Dividido conforme criamos) ---
  { name: 'Solicitações Pgto', icon: FilePlus, path: '/dashboard/financeiro/solicitacao' },
  { name: 'Contas a Pagar', icon: CreditCard, path: '/dashboard/financeiro/contas-a-pagar' },
  { name: 'Contas a Receber', icon: Wallet, path: '/dashboard/financeiro/contas-a-receber' },
  { name: 'Cadastros Fin.', icon: Settings, path: '/dashboard/financeiro/cadastros' },

  // --- GERENCIAL ---
  // Novo módulo de Relatórios
  { name: 'Relatórios', icon: PieChart, path: '/dashboard/relatorios' },

  // --- CADASTROS GERAIS ---
  { name: 'Motoristas & Frota', icon: Truck, path: '/dashboard/motoristas' },
  { name: 'Clientes', icon: Users, path: '/dashboard/clientes' },
  { name: 'Tabela Frete', icon: MapIcon, path: '/dashboard/tabela-frete' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col fixed left-0 top-0 overflow-y-auto z-50">
      <div className="flex items-center gap-2 mb-8 px-2 mt-4">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-blue-900/50">
          S
        </div>
        <div>
           <span className="text-xl font-bold tracking-tight block leading-none">SANMEXX</span>
           <span className="text-[10px] text-slate-400 font-normal">Logística Inteligente</span>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          // Verifica se está ativo (incluindo sub-rotas)
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          
          return (
            <Link key={item.path} href={item.path}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20 translate-x-1' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
              }`}>
                <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-slate-800 pt-4 pb-4">
        <Link href="/">
           <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer group">
             <Settings size={20} className="group-hover:rotate-90 transition-transform" />
             <span className="font-medium text-sm">Sair do Sistema</span>
           </div>
        </Link>
      </div>
    </aside>
  );
}