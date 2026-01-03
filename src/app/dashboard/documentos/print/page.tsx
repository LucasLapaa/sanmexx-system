'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// --- 1. COMPONENTE DE CONTEÚDO (Usa os parâmetros da URL) ---
function PrintContent() {
  const searchParams = useSearchParams();
  const tipo = searchParams.get('tipo'); // 'minuta' ou 'ordem'
  const id = searchParams.get('id');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento e dispara a impressão
    const timer = setTimeout(() => {
        setLoading(false);
        // Pequeno delay para garantir que renderizou antes de abrir a janela de print
        setTimeout(() => window.print(), 500);
    }, 1000);
    return () => clearTimeout(timer);
  }, [id, tipo]);

  if (loading) return <div className="p-10 text-center font-bold">Preparando documento para impressão...</div>;

  return (
    <div className="p-8 print:p-0 bg-white min-h-screen text-black">
      <div className="max-w-4xl mx-auto border border-black p-8 print:border-none print:p-0">
        
        {/* CABEÇALHO */}
        <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-6">
            <h1 className="text-2xl font-bold uppercase">
                {tipo === 'minuta' ? 'Minuta de Transporte' : 'Ordem de Coleta'}
            </h1>
            <div className="text-right">
                <p className="font-bold">SANMEXX LOGÍSTICA</p>
                <p className="text-xs">ID Processo: {id || 'N/A'}</p>
            </div>
        </div>

        {/* CONTEÚDO */}
        <div className="space-y-4">
            <p>Documento oficial gerado pelo sistema Sanmexx.</p>
            
            <div className="grid grid-cols-2 gap-4 border border-black p-4">
                <div><strong>Tipo de Documento:</strong> {tipo}</div>
                <div><strong>Data de Emissão:</strong> {new Date().toLocaleDateString()}</div>
                <div><strong>Status:</strong> VÁLIDO</div>
                <div><strong>Emissor:</strong> SISTEMA</div>
            </div>

            <div className="border border-black p-4 mt-8 h-64 flex items-center justify-center bg-gray-50 text-gray-400 font-bold text-xl uppercase tracking-widest">
                {tipo === 'minuta' ? 'Dados da Carga & Transporte' : 'Instruções de Coleta'}
            </div>
        </div>

        {/* RODAPÉ */}
        <div className="mt-20 pt-4 border-t border-black flex justify-between text-xs">
            <p>Emitido eletronicamente - Sanmexx</p>
            <p>{new Date().toLocaleString()}</p>
        </div>

      </div>
      
      <style jsx global>{`
        @media print {
            @page { margin: 0; }
            body { background: white; -webkit-print-color-adjust: exact; }
            .print\\:hidden { display: none; }
            .print\\:border-none { border: none; }
            .print\\:p-0 { padding: 0; }
        }
      `}</style>
    </div>
  );
}

// --- 2. PÁGINA PRINCIPAL (A "Barreira" de Suspense) ---
// Isso impede que o erro de build aconteça ao tentar ler a URL
export default function PrintPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Carregando sistema de impressão...</div>}>
      <PrintContent />
    </Suspense>
  );
}