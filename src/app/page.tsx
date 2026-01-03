import Link from 'next/link';
import Image from 'next/image';
import logoSanmexx from '@/LOGO 04.png'; // Verifique se o arquivo está em src/

export default function Home() {
  return (
    // h-screen + overflow-hidden: Trava a tela para não ter barra de rolagem
    <main className="h-screen w-full relative overflow-hidden bg-[#050505] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* --- EFEITOS DE FUNDO (GLOWS SUTIS) --- */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 md:w-[600px] md:h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 md:w-[500px] md:h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-6">
        
        <div className="w-full max-w-3xl flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-1000">
          
          {/* LOGO LARGA - Sem card branco */}
          <div className="relative mb-8 group">
            {/* Efeito de brilho ao passar o mouse */}
            <div className="absolute inset-0 bg-blue-500/15 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <Image 
              src={logoSanmexx} 
              alt="Logo Sanmexx" 
              // Largura ajustada para 500px no desktop
              className="w-72 md:w-[500px] h-auto mx-auto object-contain relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              priority
            />
          </div>

          {/* BARRA DECORATIVA */}
          <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8"></div>
          
          {/* TEXTOS */}
          <div className="mb-10 space-y-2">
            <h1 className="text-white text-lg md:text-xl font-light tracking-[0.3em] uppercase opacity-90">
              Gestão Logística
            </h1>
            <p className="text-slate-500 text-xs md:text-sm font-normal tracking-wider">
              Controle total de frota, cargas e parceiros.
            </p>
          </div>

          {/* BOTÃO QUE DIRECIONA PARA O LOGIN */}
          {/* Ajustado para /login. Se sua rota for diferente, altere aqui */}
          <Link href="/login" className="group">
            <button className="relative overflow-hidden rounded-full p-[1px] transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
              {/* Borda giratória */}
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 animate-[spin_3s_linear_infinite]"></span>
              
              <div className="relative bg-[#050505] text-white px-14 py-4 rounded-full font-bold text-base md:text-lg flex items-center justify-center gap-3 transition-colors group-hover:bg-zinc-900">
                Acessar Painel
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </button>
          </Link>

          {/* CRÉDITO NO RODAPÉ */}
          <p className="mt-16 text-slate-700 text-[10px] tracking-[0.2em] uppercase flex items-center gap-2">
            Desenvolvido por <span className="text-slate-500 font-bold">Lucas Lapa</span>
          </p>
        </div>
      </div>

    </main>
  );
}