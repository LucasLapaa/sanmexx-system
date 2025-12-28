'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Truck, DollarSign, Users, FileText, LogOut } from 'lucide-react';

const menuItems = [
  { name: 'Visão Geral', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Operacional', icon: Truck, path: '/dashboard/operacional' },
  { name: 'Financeiro', icon: DollarSign, path: '/dashboard/financeiro' },
  { name: 'Motoristas & Frota', icon: Truck, path: '/dashboard/motoristas' },
  { name: 'Clientes', icon: Users, path: '/dashboard/clientes' },
  { name: 'Contratos', icon: FileText, path: '/dashboard/contratos/novo' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 shadow-2xl z-50">
      {/* Logo Area */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold tracking-wider text-blue-400">SANMEXX</h1>
        <p className="text-xs text-slate-400 mt-1">Sistema Integrado Logística</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 space-y-2 px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg translate-x-1' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-700">
        <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Sair do Sistema</span>
        </Link>
      </div>
    </aside>
  );
}