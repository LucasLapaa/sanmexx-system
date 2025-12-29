'use client';

import { useState, useRef } from 'react';
import { Upload, Plus, Search, FileSpreadsheet, Save } from 'lucide-react';
import * as XLSX from 'xlsx';

// Definição do tipo de dado do Frete
interface Frete {
  id: string;
  origem: string;
  destino: string;
  veiculo: string;
  valor: number | string; // Aceita string na importação e depois convertemos
}

export default function TabelaFretePage() {
  const [fretes, setFretes] = useState<Frete[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função que é chamada quando você escolhe o arquivo Excel
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target?.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });

      // Pega a primeira aba do Excel
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Converte as linhas do Excel para JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];

      // Mapeia os dados para o formato do nosso sistema
      // ATENÇÃO: O Excel precisa ter cabeçalhos parecidos com: Origem, Destino, Veiculo, Valor
      const formattedData: Frete[] = jsonData.map((row, index) => ({
        id: `excel-${index}`,
        origem: row['Origem'] || row['origem'] || 'Não informado',
        destino: row['Destino'] || row['destino'] || 'Não informado',
        veiculo: row['Veiculo'] || row['Veículo'] || row['veiculo'] || 'Caminhão',
        valor: row['Valor'] || row['valor'] || 0,
      }));

      setFretes(formattedData);
    };

    reader.readAsBinaryString(file);
  };

  // Função para simular o clique no input escondido
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* CABEÇALHO */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tabela de Frete</h1>
          <p className="text-slate-500">Gerencie os valores de frete por rota</p>
        </div>
        
        <div className="flex gap-3">
          {/* Botão de Importar Excel */}
          <button 
            onClick={triggerFileInput}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FileSpreadsheet size={20} />
            Importar Excel
          </button>
          
          {/* Input Escondido (O segredo para abrir a janela de arquivos) */}
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Plus size={20} />
            Novo Manual
          </button>
        </div>
      </div>

      {/* ÁREA DA TABELA */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar por origem ou destino..." 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>

        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-4">Origem</th>
              <th className="p-4">Destino</th>
              <th className="p-4">Veículo</th>
              <th className="p-4">Valor (R$)</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {fretes.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  Nenhum frete carregado. Clique em "Importar Excel".
                </td>
              </tr>
            ) : (
              fretes.map((frete) => (
                <tr key={frete.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-medium">{frete.origem}</td>
                  <td className="p-4">{frete.destino}</td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                        {frete.veiculo}
                    </span>
                  </td>
                  <td className="p-4 text-green-700 font-bold">
                    {typeof frete.valor === 'number' 
                        ? frete.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                        : `R$ ${frete.valor}`}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">Editar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Botão para Salvar no Banco (Futuro) */}
      {fretes.length > 0 && (
          <div className="flex justify-end">
              <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-bold shadow-lg">
                  <Save size={20} />
                  Salvar Importação no Sistema
              </button>
          </div>
      )}
    </div>
  );
}