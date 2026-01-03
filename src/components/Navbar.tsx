'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calculator, 
  Users, 
  Workflow, 
  DollarSign, 
  BarChart3, 
  Folder,
  LogOut,
  ChevronDown // Ícone da setinha
} from 'lucide-react';

// Estrutura do Menu com Subitens
const menuItems = [
  { name: 'Visão Geral', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Cotação', icon: Calculator, path: '/dashboard/cotacao' },
  
  // --- AQUI ESTÁ A MUDANÇA: O MENU CADASTRO AGORA TEM "CHILDREN" (FILHOS) ---
  { 
    name: 'Cadastro', 
    icon: Users, 
    path: '#', // Não tem link direto, pois abre o menu
    children: [
      { name: 'Cliente', path: '/dashboard/cadastro/cliente' },
      { name: 'Fornecedor', path: '/dashboard/cadastro/fornecedores' },
      { name: 'Motorista', path: '/dashboard/cadastro/motoristas' },
      { name: 'Veículo', path: '/dashboard/cadastro/veiculos' },
      { name: 'Agente de Cargas', path: '/dashboard/cadastro/agente-cargas' },
      { name: 'Armador', path: '/dashboard/cadastro/armador' },
      { name: 'Terminal/Armazém', path: '/dashboard/cadastro/terminal' },
      { name: 'Exportador/Importador', path: '/dashboard/cadastro/exp-imp' },
      { name: 'Depot', path: '/dashboard/cadastro/depot' },
      { name: 'Navio', path: '/dashboard/cadastro/navio' },
      { name: 'Porto', path: '/dashboard/cadastro/porto' },
      { name: 'Origem/Destino', path: '/dashboard/cadastro/origem-destino' },
    ]
  },
  
  { name: 'Processos', icon: Workflow, path: '/dashboard/processos' },
  { name: 'Financeiro', icon: DollarSign, path: '/dashboard/financeiro' },
  { name: 'Relatórios', icon: BarChart3, path: '/dashboard/relatorios' },
  { name: 'Documentos', icon: Folder, path: '/dashboard/documentos' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="h-14 bg-slate-900 text-white fixed top-0 left-0 right-0 z-50 shadow-md flex items-center justify-between px-6">
      
      {/* LOGO */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-sm shadow-blue-900/50">
          S
        </div>
        <span className="font-bold tracking-tight text-lg hidden md:block">SANMEXX</span>
      </div>

      {/* MENU HORIZONTAL */}
      <nav className="flex items-center gap-1 h-full">
        {menuItems.map((item) => {
          // Verifica se o item principal ou algum filho está ativo
          const isActive = pathname === item.path || (item.children && item.children.some(child => pathname === child.path));
          
          // SE TIVER SUBITENS (COMO O CADASTRO), RENDERIZA UM DROPDOWN
          if (item.children) {
            return (
              <div key={item.name} className="relative group h-full flex items-center">
                <button 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 text-sm font-medium
                    ${isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <item.icon size={16} />
                  {item.name}
                  <ChevronDown size={14} className="ml-1 opacity-70 group-hover:rotate-180 transition-transform" />
                </button>

                {/* O SUBMENU QUE APARECE AO PASSAR O MOUSE */}
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-xl border border-slate-200 overflow-hidden hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
                  <div className="py-1">
                    {item.children.map((subItem) => (
                      <Link key={subItem.path} href={subItem.path}>
                        <div className="px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer border-l-2 border-transparent hover:border-blue-500">
                          {subItem.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          // SE FOR UM ITEM NORMAL (SEM SUBMENU)
          return (
            <Link key={item.path} href={item.path}>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 text-sm whitespace-nowrap ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}>
                <item.icon size={16} />
                <span className="font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* SAIR */}
      <button className="text-slate-400 hover:text-red-400 transition-colors p-2">
        <LogOut size={18} />
      </button>

    </header>
  );
}