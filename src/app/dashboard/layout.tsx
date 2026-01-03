// Importamos a nova Navbar
import Navbar from '../../components/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra Superior Fixa */}
      <Navbar />
      
      {/* Conteúdo Principal */}
      {/* pt-16: Dá espaço para a barra não cobrir o conteúdo */}
      {/* w-full: Ocupa a largura toda (não tem mais menu lateral) */}
      <main className="pt-16 p-6 w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}