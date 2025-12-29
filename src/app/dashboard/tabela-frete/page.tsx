'use client';

import { useState, useRef } from 'react';
import { Upload, Plus, Search, FileSpreadsheet, Save, Trash2, Edit } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function TabelaFretePage() {
  // Agora não usamos uma tipagem fixa (Frete), usamos "any" para aceitar qualquer coluna
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]); // Guarda os nomes das colunas
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target?.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Converte o Excel para JSON bruto
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length > 0) {
        // 1. Descobre os nomes das colunas baseado na primeira linha
        const cols = Object.keys(jsonData[0] as object);
        setHeaders(cols);

        // 2. Adiciona um ID para cada linha para o React não reclamar
        const formattedData = jsonData.map((row: any, index) => ({
          ...row,
          id_temp: `row-${index}` // ID temporário para controle visual
        }));

        setData(formattedData);
      }
    };

    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearTable = () => {
    setData([]);
    setHeaders([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Importação Dinâmica</h1>
          <p className="text-slate-500">O sistema lerá exatamente o que estiver no seu Excel</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={triggerFileInput}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm"
          >
            <FileSpreadsheet size={20} />
            Carregar Arquivo
          </button>
          
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />

          {data.length > 0 && (
            <button 
                onClick={clearTable}
                className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg"
            >
                <Trash2 size={20} />
                Limpar
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* TABELA DINÂMICA */}
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase text-xs">
                <tr>
                {/* 1. Renderiza os cabeçalhos dinamicamente */}
                {headers.map((header) => (
                    <th key={header} className="p-4 whitespace-nowrap">{header}</th>
                ))}
                {headers.length > 0 && <th className="p-4 text-right">Ações</th>}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {data.length === 0 ? (
                <tr>
                    <td colSpan={100} className="p-12 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                            <FileSpreadsheet size={48} className="text-slate-200" />
                            <p>Nenhum dado. Importe qualquer planilha.</p>
                        </div>
                    </td>
                </tr>
                ) : (
                data.map((row) => (
                    <tr key={row.id_temp} className="hover:bg-slate-50">
                    {/* 2. Renderiza as células baseado nos cabeçalhos encontrados */}
                    {headers.map((colName) => (
                        <td key={`${row.id_temp}-${colName}`} className="p-4 border-b border-slate-50">
                            {/* Verifica se é valor monetário para formatar, senão mostra texto normal */}
                            {typeof row[colName] === 'number' && (colName.toLowerCase().includes('valor') || colName.toLowerCase().includes('preco'))
                                ? `R$ ${row[colName]}` 
                                : row[colName]}
                        </td>
                    ))}
                    
                    {/* Coluna fixa de ações */}
                    <td className="p-4 text-right">
                        <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                            <Edit size={16} />
                        </button>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-200">
        <strong>Nota:</strong> Como esta tabela é dinâmica, verifique se as colunas correspondem ao que o banco de dados espera antes de salvar.
      </div>
    </div>
  );
}