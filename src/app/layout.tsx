// IMPORTANTE: AS CHAVES { } SÃO OBRIGATÓRIAS AQUI
import { Sidebar } from '../../components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Menu Lateral Fixo */}
      <Sidebar />
      
      {/* Área de Conteúdo */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}