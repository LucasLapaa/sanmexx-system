'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// --- 1. CONTEÚDO DA FATURA (Onde lemos a URL) ---
function FaturaPrintContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento para evitar erro de hidratação e dispara o print
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => window.print(), 500);
    }, 800);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) return <div className="p-10 text-center font-bold">Gerando Fatura...</div>;

  return (
    <div className="p-8 print:p-0 bg-white min-h-screen text-black font-sans">
      <div className="max-w-4xl mx-auto border border-gray-300 p-8 print:border-none print:p-0">
        
        {/* TOPO: LOGO E TÍTULO */}
        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8">
            <div>
                <div className="w-12 h-12 bg-slate-800 text-white flex items-center justify-center font-bold text-xl rounded mb-2">S</div>
                <h1 className="text-xl font-bold uppercase tracking-wide">Sanmexx Logística</h1>
                <p className="text-xs text-gray-500">CNPJ: 00.000.000/0001-00</p>
                <p className="text-xs text-gray-500">Rua da Logística, 123 - Santos/SP</p>
            </div>
            <div className="text-right">
                <h2 className="text-3xl font-bold text-slate-700 uppercase">Fatura / Invoice</h2>
                <p className="text-lg font-mono text-red-600 font-bold mt-2">#{id || '0000'}</p>
                <p className="text-sm text-gray-500 mt-1">Emissão: {new Date().toLocaleDateString()}</p>
            </div>
        </div>

        {/* DADOS DO CLIENTE */}
        <div className="mb-8 p-4 bg-gray-50 rounded border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Tomador do Serviço (Cliente)</h3>
            <p className="font-bold text-lg">CLIENTE EXEMPLO LTDA</p>
            <p className="text-sm text-gray-600">CNPJ: 99.999.999/0001-99</p>
            <p className="text-sm text-gray-600">Endereço: Av. Industrial, 500 - São Paulo/SP</p>
        </div>

        {/* DETALHES DO SERVIÇO */}
        <table className="w-full text-left mb-8 border-collapse">
            <thead>
                <tr className="bg-slate-800 text-white text-sm uppercase">
                    <th className="p-3">Descrição do Serviço</th>
                    <th className="p-3 text-center">Ref. Processo</th>
                    <th className="p-3 text-right">Valor (R$)</th>
                </tr>
            </thead>
            <tbody>
                <tr className="border-b border-gray-200">
                    <td className="p-3">Serviço de Transporte Rodoviário (Frete)</td>
                    <td className="p-3 text-center">TR-{id?.slice(0,4) || 'XXXX'}</td>
                    <td className="p-3 text-right font-bold">5.450,00</td>
                </tr>
                <tr className="border-b border-gray-200">
                    <td className="p-3">Taxa Administrativa / Pedágios</td>
                    <td className="p-3 text-center">-</td>
                    <td className="p-3 text-right font-bold">250,00</td>
                </tr>
            </tbody>
        </table>

        {/* TOTAIS */}
        <div className="flex justify-end mb-12">
            <div className="w-1/2 bg-slate-50 p-4 rounded text-right">
                <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold">R$ 5.700,00</span>
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                    <span className="text-xl font-bold text-slate-800">TOTAL A PAGAR</span>
                    <span className="text-xl font-bold text-slate-800">R$ 5.700,00</span>
                </div>
            </div>
        </div>

        {/* DADOS PARA PAGAMENTO */}
        <div className="border-t border-gray-300 pt-6">
            <h4 className="font-bold text-sm uppercase mb-2">Dados Bancários para Depósito</h4>
            <div className="flex gap-8 text-sm text-gray-700">
                <p><strong>Banco:</strong> 341 - Itaú</p>
                <p><strong>Agência:</strong> 1234</p>
                <p><strong>Conta Corrente:</strong> 00123-4</p>
                <p><strong>Pix:</strong> financeiro@sanmexx.com.br</p>
            </div>
            <p className="text-xs text-gray-400 mt-4">Vencimento em 15 dias a partir da data de emissão. Juros de 2% ao mês após o vencimento.</p>
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

// --- 2. PÁGINA PRINCIPAL (Proteção Suspense) ---
export default function FaturaPrintPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Carregando sistema de faturas...</div>}>
      <FaturaPrintContent />
    </Suspense>
  );
}