'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

export default function ImportarFretePage() {
  const router = useRouter();
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(false);

  const processarTexto = () => {
    const linhas = texto.trim().split('\n');
    
    const dadosFormatados = linhas.map(linha => {
      const colunas = linha.includes('\t') ? linha.split('\t') : linha.split(';');
      
      if(colunas.length < 4) return null; 

      // Se tiver 5 colunas, a primeira é Região. Se tiver 4, Região é automático.
      if (colunas.length >= 5) {
        return {
          regiao: colunas[0]?.trim(),
          origem: colunas[1]?.trim(),
          destino: colunas[2]?.trim(),
          tipoVeiculo: colunas[3]?.trim(),
          valor: colunas[4]?.trim()
        };
      } else {
        return {
          regiao: 'GERAL',
          origem: colunas[0]?.trim(),
          destino: colunas[1]?.trim(),
          tipoVeiculo: colunas[2]?.trim(),
          valor: colunas[3]?.trim()
        };
      }
    }).filter(item => item !== null);

    return dadosFormatados;
  };

  const handleImportar = async () => {
    const dados = processarTexto();
    
    if (dados.length === 0) {
      alert('Nenhum dado válido encontrado.');
      return;
    }

    if(!confirm(`Identificamos ${dados.length} rotas. Deseja importar?`)) return;

    setLoading(true);
    try {
      const res = await fetch('/api/fretes/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dados })
      });

      if (res.ok) {
        const resposta = await res.json();
        alert(`Sucesso! ${resposta.count} rotas importadas.`);
        router.push('/dashboard/tabela-frete');
      } else {
        alert('Erro ao importar.');
      }
    } catch (error) {
      alert('Erro de conexão.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
        
        <div className="flex items-center gap-4 mb-6 pb-4 border-b">
          <Link href="/dashboard/tabela-frete">
            <ArrowLeft className="text-gray-400 hover:text-blue-900 cursor-pointer" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileSpreadsheet className="text-green-600" /> Importar do Excel/CSV
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg h-fit">
            <h3 className="font-bold text-blue-900 mb-4">Como importar:</h3>
            <ol className="list-decimal list-inside space-y-3 text-sm text-blue-800">
              <li>Copie as linhas do Excel (sem cabeçalho).</li>
              <li>Ordem das colunas:
                <div className="mt-2 font-mono bg-white p-2 border border-blue-200 rounded text-xs font-bold">
                  REGIÃO | ORIGEM | DESTINO | VEÍCULO | VALOR
                </div>
              </li>
              <li>Cole na caixa ao lado e clique em Processar.</li>
            </ol>
          </div>

          <div className="flex flex-col gap-4">
            <textarea 
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg p-4 text-xs font-mono focus:border-blue-500 outline-none resize-none"
              placeholder={`Exemplo:\nMT\tCuiabá\tSorriso\tCarreta\t5.000,00\nSP\tSantos\tSão Paulo\tTruck\t1.200,00`}
            ></textarea>

            <button 
              onClick={handleImportar}
              disabled={loading || !texto}
              className={`w-full py-3 rounded-lg font-bold text-white flex justify-center gap-2 transition ${
                loading || !texto ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? 'Importando...' : <><Upload /> Processar e Salvar</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}