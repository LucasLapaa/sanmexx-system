import Link from 'next/link';
import Image from 'next/image';
import logoSanmexx from '@/LOGO 04.png'; // Certifique-se que o arquivo está em src/

export default function Home() {
  return (
    // h-screen + overflow-hidden: Elimina qualquer possibilidade de barra de rolagem
    <main className="h-screen w-full relative overflow-hidden bg-[#0B1221] flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      
      {/* --- EFEITOS DE FUNDO (GLOWS) --- */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 md:w-[500px] md:h-[500px] bg-blue-600/20 rounded-full blur-[80px] md:blur-[100px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-48 h-48 md:w-[400px] md:h-[400px] bg-cyan-500/10 rounded-full blur-[80px] md:blur-[100px] animate-pulse delay-1000 pointer-events-none"></div>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-4">
        
        {/* CARD CENTRAL */}
        <div className="w-full max-w-md md:max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl text-center animate-in fade-in zoom-in duration-700 mx-2 flex flex-col items-center justify-center">
          
          {/* LOGO - Aumentada conforme solicitado (w-48 md:w-80) */}
          <div className="relative group mb-4">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-700"></div>
            <div className="relative bg-white rounded-xl p-4 md:p-5 shadow-xl transform transition-transform duration-500 hover:scale-[1.02]">
              <Image 
                src={logoSanmexx} 
                alt="Logo Sanmexx" 
                className="w-48 md:w-80 h-auto mx-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* BARRA DECORATIVA */}
          <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-4"></div>
          
          {/* TEXTOS */}
          <div className="mb-6">
            <h1 className="text-white text-base md:text-lg font-medium tracking-wide mb-1">
              Sistema Integrado de Gestão Logística.
            </h1>
            <p className="text-slate-400 text-xs md:text-sm font-light">
              Controle total de frota, cargas e parceiros.
            </p>
          </div>

          {/* BOTÃO DE ACESSO - Redirecionando para /login */}
          <Link href="/login" className="w-full sm:w-auto group mb-6">
            <button className="relative w-full sm:w-auto overflow-hidden rounded-lg p-[1px]">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 animate-[spin_4s_linear_infinite] opacity-70"></span>
              <div className="relative bg-slate-900 text-white px-8 py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all group-hover:bg-slate-800">
                Acessar Painel
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          </Link>

          {/* CRÉDITO */}
          <p className="text-slate-500 text-[10px] md:text-xs flex items-center gap-1 font-medium">
            Desenvolvido com <span className="text-red-500/80 animate-pulse">❤️</span> por <strong className="text-slate-300">Lucas Lapa</strong>
          </p>
        </div>
      </div>

    </main>
  );
}