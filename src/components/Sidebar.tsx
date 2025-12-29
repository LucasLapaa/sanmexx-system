'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// 1. AQUI ESTÁ A CORREÇÃO: "Map as MapIcon"
import { LayoutDashboard, Users, FileText, Settings, Truck, DollarSign, Map as MapIcon } from 'lucide-react';

const menuItems = [
  { name: 'Visão Geral', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Operacional', icon: Truck, path: '/dashboard/operacional' },
  { name: 'Financeiro', icon: DollarSign, path: '/dashboard/financeiro' },
  { name: 'Motoristas & Frota', icon: Truck, path: '/dashboard/motoristas' },
  { name: 'Clientes', icon: Users, path: '/dashboard/clientes' },
  { name: 'Contratos', icon: FileText, path: '/dashboard/contratos' },
  // 2. USAMOS O APELIDO "MapIcon" AQUI
  { name: 'Tabela Frete', icon: MapIcon, path: '/dashboard/tabela-frete' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col fixed left-0 top-0 overflow-y-auto z-50">
      
      {/* LOGO */}
      <div className="flex items-center gap-2 mb-10 px-2 mt-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/50">
          S
        </div>
        <span className="text-xl font-bold tracking-tight">SANMEXX</span>
      </div>

      {/* NAVEGAÇÃO */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
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

      {/* RODAPÉ / SAIR */}
      <div className="mt-auto border-t border-slate-800 pt-4">
        <Link href="/">
           <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
             <Settings size={20} />
             <span className="font-medium text-sm">Sair do Sistema</span>
           </div>
        </Link>
      </div>
    </aside>
  );
}