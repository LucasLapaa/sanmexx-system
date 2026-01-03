import Navbar from '@/components/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Barra Superior Fixa */}
      <Navbar />
      
      {/* Conteúdo Principal (flex-1 faz ele ocupar o espaço todo, empurrando o rodapé) */}
      <main className="pt-16 p-6 w-full max-w-7xl mx-auto flex-1">
        {children}
      </main>

      {/* RODAPÉ */}
      <footer className="py-6 text-center text-sm text-slate-400 border-t border-slate-200 mt-4">
        <p>
          Feito com <span className="text-red-500 animate-pulse">❤️</span> por <strong>Lucas Lapa</strong>
        </p>
      </footer>
    </div>
  );
}