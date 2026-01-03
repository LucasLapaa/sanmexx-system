'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Building2, // Icone Fornecedor
  Car,       // Icone Veiculo
  Anchor     // Icone Processos
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'Visão Geral', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Processos', href: '/dashboard/processos', icon: Anchor },
  
  // --- CADASTROS (Links corrigidos para PLURAL) ---
  { name: 'Clientes', href: '/dashboard/clientes', icon: Users },
  { name: 'Fornecedores', href: '/dashboard/fornecedores', icon: Building2 }, // <--- Corrigido
  { name: 'Veículos', href: '/dashboard/veiculos', icon: Truck },             // <--- Corrigido
  { name: 'Motoristas', href: '/dashboard/motoristas', icon: Car },           // <--- Corrigido
  
  // Se quiser agrupar Financeiro depois, pode adicionar aqui
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-900 text-white fixed top-0 w-full z-50 shadow-md h-16">
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
          
          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">S</div>
            <span className="font-bold text-lg tracking-tight">SANMEXX</span>
          </div>

          {/* MENU DESKTOP (Horizontal) */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}>
                    <item.icon size={16} />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* BOTAO SAIR E MOBILE */}
          <div className="flex items-center gap-4">
            <Link href="/" className="hidden md:flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm font-medium transition-colors">
              <LogOut size={16} />
              Sair
            </Link>

            {/* Botão Hamburger Mobile */}
            <button 
              className="md:hidden text-slate-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE (Expansível) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}>
                    <item.icon size={18} />
                    {item.name}
                  </div>
                </Link>
              );
            })}
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-700 hover:text-red-300 flex items-center gap-2">
              <LogOut size={18} /> Sair do Sistema
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}