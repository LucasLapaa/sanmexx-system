'use client';

import { useState, useRef } from 'react';
import { Upload, Plus, Search, FileSpreadsheet, Save, Trash2, Edit } from 'lucide-react';
import * as XLSX from 'xlsx';

// Definição do tipo de dado do Frete
interface Frete {
  id: string;
  origem: string;
  destino: string;
  veiculo: string;
  valor: number | string;
}

export default function TabelaFretePage() {
  const [fretes, setFretes] = useState<Frete[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- FUNÇÃO INTELIGENTE DE UPLOAD ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target?.result;
      
      // Lê o arquivo Excel
      const workbook = XLSX.read(binaryStr, { type: 'binary' });

      // Pega a primeira aba
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Converte para JSON bruto
      const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];

      // Mapeia e limpa os dados
      const formattedData: Frete[] = jsonData.map((row, index) => {
        
        // Função auxiliar para procurar o valor ignorando maiúsculas/minúsculas e acentos
        const findValue = (possibleKeys: string[]) => {
          const rowKeys = Object.keys(row);
          // Procura uma chave no Excel que bata com as nossas opções
          const foundKey = rowKeys.find(k => 
            possibleKeys.some(pk => k.trim().toLowerCase().includes(pk))
          );
          return foundKey ? row[foundKey] : null;
        };

        return {
          id: `excel-${index}`,
          // Tenta achar Origem, Coleta, Cidade Origem...
          origem: findValue(['origem', 'coleta', 'saida']) || 'Não informado',
          
          // Tenta achar Destino, Entrega, Cidade Destino...
          destino: findValue(['destino', 'entrega', 'chegada']) || 'Não informado',
          
          // Tenta achar Veículo, Tipo, Caminhão...
          veiculo: findValue(['veiculo', 'veículo', 'tipo', 'caminhao']) || 'Caminhão',
          
          // Tenta achar Valor, Preço, Frete, Custo...
          valor: findValue(['valor', 'preco', 'preço', 'frete', 'custo']) || 0,
        };
      });

      console.log("Dados Processados:", formattedData); // Ajuda a debugar
      setFretes(formattedData);
    };

    reader.readAsBinaryString(file);
    
    // Limpa o input para permitir enviar o mesmo arquivo de novo se errar
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Função para limpar a tabela
  const clearTable = () => {
    if(confirm("Tem certeza que deseja limpar toda a tabela?")) {
        setFretes([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tabela de Frete</h1>
          <p className="text-slate-500">Importe sua planilha ou adicione manualmente</p>
        </div>
        
        <div className="flex gap-3">
          {/* Botão Importar */}
          <button 
            onClick={triggerFileInput}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <FileSpreadsheet size={20} />
            Importar Excel
          </button>
          
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />

          {/* Botão Novo Manual */}
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
            <Plus size={20} />
            Novo
          </button>

          {/* Botão Limpar (só aparece se tiver dados) */}
          {fretes.length > 0 && (
            <button 
                onClick={clearTable}
                className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg transition-colors"
            >
                <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>

      {/* ÁREA DE BUSCA E FILTROS */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Filtrar por cidade ou veículo..." 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
            </div>
        </div>

        {/* TABELA */}
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                <tr>
                <th className="p-4">Origem</th>
                <th className="p-4">Destino</th>
                <th className="p-4">Veículo</th>
                <th className="p-4">Valor Estimado</th>
                <th className="p-4 text-right">Ações</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {fretes.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                            <FileSpreadsheet size={48} className="text-slate-200" />
                            <p className="font-medium">Nenhum frete carregado</p>
                            <p className="text-xs">Importe um arquivo Excel para começar</p>
                        </div>
                    </td>
                </tr>
                ) : (
                fretes.map((frete) => (
                    <tr key={frete.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">{frete.origem}</td>
                    <td className="p-4 text-slate-800">{frete.destino}</td>
                    <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {frete.veiculo}
                        </span>
                    </td>
                    <td className="p-4 font-bold text-green-700">
                        {typeof frete.valor === 'number' 
                            ? frete.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                            : `R$ ${frete.valor}`}
                    </td>
                    <td className="p-4 text-right">
                        <button className="text-slate-400 hover:text-blue-600 p-1 hover:bg-blue-50 rounded transition-colors">
                            <Edit size={18} />
                        </button>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
      </div>
      
      {/* RODAPÉ DE AÇÃO */}
      {fretes.length > 0 && (
          <div className="flex justify-end pt-4 animate-fade-in">
              <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                  <Save size={20} />
                  Salvar {fretes.length} Fretes no Sistema
              </button>
          </div>
      )}
    </div>
  );
}