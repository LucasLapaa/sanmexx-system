'use client';

import { useState, useRef } from 'react';
import { FileSpreadsheet, Trash2, Save, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function TabelaFretePage() {
  // Agora guardamos uma "Matriz" (Lista de Listas), exatamente como o Excel é
  const [tableRows, setTableRows] = useState<any[][]>([]);
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

      // --- O SEGREDO ESTÁ AQUI: { header: 1 } ---
      // Isso diz: "Não tente adivinhar cabeçalhos. Me dê os dados brutos linha a linha."
      const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

      setTableRows(rawData);
    };

    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearTable = () => {
    setTableRows([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Visualizador de Excel</h1>
          <p className="text-slate-500">Espelho exato da sua planilha</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={triggerFileInput}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm"
          >
            <FileSpreadsheet size={20} />
            Carregar Excel
          </button>
          
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />

          {tableRows.length > 0 && (
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
        <div className="overflow-x-auto max-h-[70vh]"> {/* Adicionado scroll vertical também */}
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
            
            {/* CABEÇALHO (LINHA 1 DO EXCEL) */}
            <thead className="bg-slate-100 text-slate-700 font-bold border-b-2 border-slate-300 sticky top-0 z-10">
                {tableRows.length > 0 && (
                    <tr>
                        {tableRows[0].map((cell: any, index: number) => (
                            <th key={index} className="p-3 border border-slate-200 whitespace-nowrap min-w-[150px]">
                                {cell}
                            </th>
                        ))}
                    </tr>
                )}
            </thead>

            {/* CORPO (RESTO DAS LINHAS) */}
            <tbody className="divide-y divide-slate-100">
                {tableRows.length <= 1 ? (
                <tr>
                    <td colSpan={10} className="p-12 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                            <Upload size={48} className="text-slate-200" />
                            <p>Carregue um arquivo para visualizar</p>
                        </div>
                    </td>
                </tr>
                ) : (
                // Começamos do índice 1 para pular o cabeçalho
                tableRows.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-blue-50 transition-colors">
                        {/* Se a linha for menor que o cabeçalho, preenchemos com células vazias para não quebrar o layout */}
                        {tableRows[0].map((_, colIndex) => (
                            <td key={colIndex} className="p-3 border border-slate-200 whitespace-nowrap">
                                {row[colIndex] !== undefined ? row[colIndex] : ''}
                            </td>
                        ))}
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
      </div>
      
      {tableRows.length > 0 && (
          <div className="flex justify-end pt-4">
              <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-bold shadow-lg">
                  <Save size={20} />
                  Processar Dados
              </button>
          </div>
      )}
    </div>
  );
}