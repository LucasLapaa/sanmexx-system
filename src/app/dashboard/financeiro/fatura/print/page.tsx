'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getDadosFatura } from '@/app/actions/financeiroReceberActions';
import { Loader2 } from 'lucide-react';

export default function PrintFaturaPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (id) {
        getDadosFatura(id).then(res => setData(res));
    }
  }, [id]);

  if (!data) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /> Gerando Nota...</div>;

  const { cliente, processo, valorTotal, numero, dataEmissao, dataVencimento, infoComplementar } = data;
  const itensVenda = processo.itensFinanceiros.filter((i:any) => i.tipo === 'VENDA' && i.valor > 0);

  return (
    <div className="bg-white text-black p-10 max-w-[210mm] mx-auto font-sans text-xs leading-snug">
        
        {/* CABEÇALHO */}
        <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
            <div className="flex gap-4">
                {/* Logo Placeholder - Substitua por <img> se tiver */}
                <div className="w-32 h-16 bg-blue-900 text-white flex items-center justify-center font-bold text-lg">SANMEXX</div>
                <div>
                    <h1 className="text-lg font-bold">SANMEXX SOLUÇÃO EM TRANSPORTE E LOGÍSTICA</h1>
                    <p>CNPJ: 60.971.100/0001-97 - IE: 154.166.413.110</p>
                    <p>Rua Visconde de Embaré, 230 - Bairro Valongo, Santos - SP</p>
                    <p>Email: financeiro@sanmexx.com.br</p>
                </div>
            </div>
            <div className="text-right">
                <h2 className="text-xl font-bold">NOTA DE DÉBITO Nº {numero}</h2>
                <p><span className="font-bold">EMISSÃO:</span> {new Date(dataEmissao).toLocaleDateString('pt-BR')}</p>
                <p><span className="font-bold">VENCIMENTO:</span> {new Date(dataVencimento).toLocaleDateString('pt-BR')}</p>
            </div>
        </div>

        {/* TOMADOR (CLIENTE) */}
        <div className="border border-black p-2 mb-4">
            <div className="font-bold bg-slate-100 p-1 mb-2 border-b border-black">TOMADOR DE SERVIÇO</div>
            <div className="grid grid-cols-2">
                <div>
                    <p><span className="font-bold">Tomador:</span> {cliente.razaoSocial}</p>
                    <p><span className="font-bold">Endereço:</span> {cliente.endereco}</p>
                    <p><span className="font-bold">Cidade:</span> {cliente.cidade} / {cliente.uf} - CEP: {cliente.codigoPostal}</p>
                </div>
                <div>
                     <p><span className="font-bold">CNPJ:</span> {cliente.cnpj}</p>
                     <p><span className="font-bold">Insc. Est:</span> {cliente.inscricaoEstadual || '-'}</p>
                </div>
            </div>
        </div>

        {/* DADOS DO PROCESSO */}
        <div className="border border-black p-2 mb-4 grid grid-cols-3 gap-2">
             <div><span className="font-bold">NAVIO:</span> {processo.navio}</div>
             <div><span className="font-bold">REF. CLIENTE:</span> {processo.refCliente}</div>
             <div><span className="font-bold">REF. SANMEXX:</span> {processo.refSanmexx}</div>
             <div><span className="font-bold">TERMINAL:</span> {processo.terminal || processo.portoDestino}</div>
             <div><span className="font-bold">BOOKING:</span> {processo.booking}</div>
             <div><span className="font-bold">OPERAÇÃO:</span> {processo.operacao}</div>
             <div><span className="font-bold">B/L Nº:</span> {processo.blMaster || processo.blHouse}</div>
             <div><span className="font-bold">DOC:</span> {processo.documentoTransporte}</div>
        </div>

        {/* TABELA DE SERVIÇOS */}
        <div className="border border-black mb-6">
            <table className="w-full">
                <thead className="bg-slate-200 border-b border-black">
                    <tr>
                        <th className="text-left p-2">DESCRIÇÃO DE SERVIÇOS</th>
                        <th className="text-right p-2 w-40">VALOR (R$)</th>
                    </tr>
                </thead>
                <tbody>
                    {itensVenda.map((item:any, idx:number) => (
                        <tr key={idx} className="border-b border-slate-300">
                            <td className="p-2 uppercase">{item.nome}</td>
                            <td className="p-2 text-right">R$ {item.valor.toFixed(2)}</td>
                        </tr>
                    ))}
                    {/* Linha Total */}
                    <tr className="font-bold bg-slate-100">
                        <td className="p-2 text-right">TOTAL DO SERVIÇO</td>
                        <td className="p-2 text-right">R$ {valorTotal.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        {/* INFO COMPLEMENTAR */}
        {infoComplementar && (
             <div className="border border-black p-2 mb-6">
                 <div className="font-bold mb-1">INFORMAÇÕES COMPLEMENTARES:</div>
                 <p className="whitespace-pre-line">{infoComplementar}</p>
             </div>
        )}

        {/* DADOS BANCÁRIOS (Fixos ou Dinâmicos) */}
        <div className="border border-black p-2 bg-slate-50">
            <div className="font-bold mb-1">DADOS BANCÁRIOS PARA DEPÓSITO:</div>
            <p>Favorecido: Sanmexx Solução em Transporte e Logística LTDA</p>
            <p>Banco: 237 - Banco Bradesco</p>
            <p>Agência: 0045 | Conta Corrente: 50877-2</p>
            <p>PIX (CNPJ): 60.971.100/0001-97</p>
        </div>
        
        <div className="mt-8 pt-4 border-t border-black text-center text-[10px] text-slate-500">
            Documento gerado eletronicamente pelo sistema Sanmexx.
        </div>
    </div>
  );
}