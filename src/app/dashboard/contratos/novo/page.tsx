'use client';
import { useState } from 'react';
import Link from 'next/link'; // <--- FALTAVA ISSO
import { Printer, Save, ArrowLeft } from 'lucide-react'; // <--- ADICIONAMOS ArrowLeft AQUI

export default function ContratoPage() {
  // ... resto do código igual ...
  const [data, setData] = useState({
    // Cabeçalho
    dataEmissao: new Date().toLocaleDateString('pt-BR'),
    numeroContrato: '001/2025',
    status: 'AGUARDANDO',
    
    
    // Contratado
    motoristaNome: '',
    motoristaCpf: '',
    motoristaRg: '',
    motoristaCnh: '',
    motoristaEndereco: '',
    motoristaBairro: '',
    motoristaCidade: '',
    motoristaUf: '',
    
    // Veículo
    placaCavalo: '',
    placaReboque: '',
    antt: '',

    // Viagem
    origem: '',
    destino: '',
    dataCarregamento: '',
    produto: '',
    peso: '',
    especie: '',
    
    // Valores (Strings para facilitar digitação, convertemos no calculo)
    frete: '0.00',
    pedagio: '0.00',
    seguro: '0.00',
    acrescimo: '0.00',
    desconto: '0.00',
    irrf: '0.00',
    inss: '0.00',
    sest: '0.00',
    iss: '0.00',
    adiantamento: '0.00',
    
    // Referencias
    refCliente: '',
    refSanmexx: '',
    clienteFinal: '',
    container: '',
    
    obs: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Cálculo Automático do Saldo
  const calcularSaldo = () => {
    const creditos = Number(data.frete) + Number(data.pedagio) + Number(data.seguro) + Number(data.acrescimo);
    const debitos = Number(data.desconto) + Number(data.irrf) + Number(data.inss) + Number(data.sest) + Number(data.iss) + Number(data.adiantamento);
    return (creditos - debitos).toFixed(2);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center gap-6 print:p-0 print:bg-white">
      
      {/* BARRA DE AÇÕES */}
      <div className="w-full max-w-[210mm] flex justify-between items-center bg-white p-4 rounded-lg shadow-sm print:hidden border border-gray-200 mb-6 sticky top-4 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/contratos" className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <ArrowLeft /> {/* Importe ArrowLeft do lucide-react */}
          </Link>
          
          {/* SELETOR DE STATUS */}
          <select 
            name="status" 
            value={data.status} 
            onChange={handleChange}
            className={`font-bold py-2 px-4 rounded-lg border-2 cursor-pointer outline-none ${
              data.status === 'ATIVO' ? 'border-green-500 text-green-700 bg-green-50' :
              data.status === 'CANCELADO' ? 'border-red-500 text-red-700 bg-red-50' :
              'border-yellow-500 text-yellow-700 bg-yellow-50'
            }`}
          >
            <option value="AGUARDANDO">🕒 AGUARDANDO</option>
            <option value="ATIVO">✅ ATIVO</option>
            <option value="CONCLUIDO">🏁 CONCLUÍDO</option>
            <option value="CANCELADO">🚫 CANCELADO</option>
            <option value="DESATIVADO">⏸ DESATIVADO</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={async () => {
              // FUNÇÃO DE SALVAR NO BANCO
              const saldo = calcularSaldo();
              const res = await fetch('/api/contratos', {
                method: 'POST',
                body: JSON.stringify({ ...data, saldoFinal: saldo })
              });
              if(res.ok) alert('Contrato Salvo no Sistema!');
            }} 
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition border border-blue-200 font-semibold"
          >
            <Save size={18} /> Salvar
          </button>
          
          <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition shadow-md font-bold">
            <Printer size={18} /> Imprimir
          </button>
        </div>
      </div>

      {/* A FOLHA A4 (Área do Contrato) */}
<div id="contrato-area" className="w-[210mm] min-h-[297mm] bg-white p-[15mm] shadow-2xl print:shadow-none print:w-full print:h-auto text-xs font-sans text-slate-900 leading-tight">
        
        {/* CABEÇALHO */}
        <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
          <img src="/logo.png" alt="Sanmexx" className="h-16 object-contain" />
          <div className="text-right">
            <h2 className="text-xl font-bold">CONTRATO PRESTAÇÃO SERVIÇO</h2>
            <p className="font-bold text-red-600 text-lg">Nº {data.numeroContrato}</p>
            <p>Data Emissão: <input name="dataEmissao" value={data.dataEmissao} onChange={handleChange} className="font-bold w-24 text-right border-b border-gray-300 focus:outline-none" /></p>
          </div>
        </div>

        {/* 1. DADOS DA EMPRESA (CONTRATANTE) */}
        <div className="mb-4 border border-black p-2 rounded-sm bg-gray-50 print:bg-transparent">
          <h3 className="font-bold border-b border-black mb-2 pb-1 bg-gray-200 print:bg-gray-200 px-1">DADOS CONTRATANTE</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p><strong>Razão Social:</strong> SANMEXX SOLUÇÃO EM TRANSPORTE E LOGÍSTICA LTDA</p>
              <p><strong>CNPJ:</strong> 60.971.100/0001-97</p>
              <p><strong>Endereço:</strong> RUA VISCONDE DE EMBARÉ, 230 CJ 1901</p>
            </div>
            <div>
              <p><strong>Cidade/UF:</strong> SANTOS - SP</p>
              <p><strong>CEP:</strong> 11010-240</p>
              <p><strong>IE:</strong> 154.166.413.110</p>
            </div>
          </div>
        </div>

        {/* 2. DADOS DO MOTORISTA (CONTRATADO) */}
        <div className="mb-4 border border-black p-2 rounded-sm">
          <h3 className="font-bold border-b border-black mb-2 pb-1 bg-gray-200 print:bg-gray-200 px-1">DADOS CONTRATADO / MOTORISTA</h3>
          <div className="grid grid-cols-12 gap-2 items-center mb-1">
            <div className="col-span-8">
              <label>Nome:</label>
              <input name="motoristaNome" value={data.motoristaNome} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 font-bold uppercase focus:outline-none" />
            </div>
            <div className="col-span-4">
              <label>CPF/CNPJ:</label>
              <input name="motoristaCpf" value={data.motoristaCpf} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-2 items-center mb-1">
            <div className="col-span-8">
              <label>Endereço:</label>
              <input name="motoristaEndereco" value={data.motoristaEndereco} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none" />
            </div>
            <div className="col-span-4">
               <label>RG:</label>
               <input name="motoristaRg" value={data.motoristaRg} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none" />
            </div>
          </div>
           <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <label>Cidade:</label>
              <input name="motoristaCidade" value={data.motoristaCidade} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none" />
            </div>
             <div className="col-span-4">
              <label>Bairro:</label>
              <input name="motoristaBairro" value={data.motoristaBairro} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none" />
            </div>
             <div className="col-span-4">
              <label>CNH:</label>
              <input name="motoristaCnh" value={data.motoristaCnh} onChange={handleChange} className="w-full border-b border-dotted border-gray-400 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* 3. DADOS VEICULO E VIAGEM */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Veículo */}
          <div className="border border-black p-2 rounded-sm">
             <h3 className="font-bold border-b border-black mb-2 bg-gray-200 print:bg-gray-200 px-1">DADOS VEÍCULO</h3>
             <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold">PLACA CAVALO</label>
                  <input name="placaCavalo" value={data.placaCavalo} onChange={handleChange} className="w-full p-1 bg-yellow-50 print:bg-transparent border border-gray-300 font-bold text-center uppercase" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold">PLACA REBOQUE</label>
                  <input name="placaReboque" value={data.placaReboque} onChange={handleChange} className="w-full p-1 bg-yellow-50 print:bg-transparent border border-gray-300 font-bold text-center uppercase" />
                </div>
                <div className="col-span-2">
                   <label className="block text-[10px]">ANTT / RNTRC</label>
                   <input name="antt" value={data.antt} onChange={handleChange} className="w-full border-b border-dotted border-gray-400" />
                </div>
             </div>
          </div>

          {/* Viagem */}
          <div className="border border-black p-2 rounded-sm">
             <h3 className="font-bold border-b border-black mb-2 bg-gray-200 print:bg-gray-200 px-1">DADOS SERVIÇO</h3>
             <div className="space-y-1">
                <div className="flex gap-2">
                  <label className="w-16 font-bold">Origem:</label>
                  <input name="origem" value={data.origem} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400" />
                </div>
                <div className="flex gap-2">
                  <label className="w-16 font-bold">Destino:</label>
                  <input name="destino" value={data.destino} onChange={handleChange} className="flex-1 border-b border-dotted border-gray-400" />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                   <div>
                      <label className="block text-[10px]">Data Início</label>
                      <input type="date" name="dataCarregamento" value={data.dataCarregamento} onChange={handleChange} className="w-full border-b border-gray-300" />
                   </div>
                   <div>
                      <label className="block text-[10px]">Tipo Carga</label>
                      <input name="produto" value={data.produto} onChange={handleChange} className="w-full border-b border-gray-300" />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* 4. COMPOSIÇÃO DO FRETE (TABELA FINANCEIRA) */}
        <div className="mb-4 border border-black rounded-sm overflow-hidden">
           <h3 className="font-bold border-b border-black p-1 bg-gray-800 text-white text-center print:bg-gray-800 print:text-white print-color-adjust-exact">COMPOSIÇÃO DO FRETE</h3>
           
           <div className="grid grid-cols-2">
              {/* CRÉDITOS */}
              <div className="border-r border-black p-2 bg-green-50 print:bg-transparent">
                 <h4 className="font-bold text-center border-b border-green-200 mb-2">CRÉDITOS (+)</h4>
                 {[
                   { label: 'Valor Frete', name: 'frete' },
                   { label: 'Pedágio', name: 'pedagio' },
                   { label: 'Seguro', name: 'seguro' },
                   { label: 'Acréscimo', name: 'acrescimo' },
                 ].map((field) => (
                   <div key={field.name} className="flex justify-between items-center mb-1">
                      <label>{field.label}</label>
                      <div className="flex items-center">
                        <span className="text-[10px] mr-1">R$</span>
                        <input name={field.name} type="number" step="0.01" value={data[field.name as keyof typeof data]} onChange={handleChange} className="w-20 text-right font-mono border border-gray-200 focus:border-blue-500 rounded px-1" />
                      </div>
                   </div>
                 ))}
              </div>

              {/* DÉBITOS */}
              <div className="p-2 bg-red-50 print:bg-transparent">
                 <h4 className="font-bold text-center border-b border-red-200 mb-2">DÉBITOS / IMPOSTOS (-)</h4>
                  {[
                   { label: 'Adiantamento', name: 'adiantamento' },
                   { label: 'Desconto', name: 'desconto' },
                   { label: 'IRRF', name: 'irrf' },
                   { label: 'INSS', name: 'inss' },
                   { label: 'SEST/SENAT', name: 'sest' },
                   { label: 'ISS', name: 'iss' },
                 ].map((field) => (
                   <div key={field.name} className="flex justify-between items-center mb-1">
                      <label>{field.label}</label>
                      <div className="flex items-center">
                        <span className="text-[10px] mr-1">R$</span>
                        <input name={field.name} type="number" step="0.01" value={data[field.name as keyof typeof data]} onChange={handleChange} className="w-20 text-right font-mono border border-gray-200 focus:border-red-500 rounded px-1" />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* TOTAL */}
           <div className="border-t border-black p-3 bg-gray-200 flex justify-between items-center print:bg-gray-200">
              <span className="font-bold text-lg">SALDO À RECEBER (LÍQUIDO)</span>
              <div className="font-bold text-xl bg-white px-4 py-1 border border-black rounded shadow-inner">
                R$ {calcularSaldo()}
              </div>
           </div>
        </div>

        {/* 5. REFERÊNCIAS */}
        <div className="mb-6 border border-black p-2">
           <table className="w-full text-center">
             <thead>
               <tr className="bg-gray-100 print:bg-gray-100 font-bold">
                 <td className="border border-gray-400 p-1">REF CLIENTE</td>
                 <td className="border border-gray-400 p-1">REF SANMEXX</td>
                 <td className="border border-gray-400 p-1">CLIENTE FINAL</td>
                 <td className="border border-gray-400 p-1">CONTAINER</td>
               </tr>
             </thead>
             <tbody>
               <tr>
                 <td className="p-1"><input name="refCliente" value={data.refCliente} onChange={handleChange} className="w-full text-center uppercase" placeholder="..." /></td>
                 <td className="p-1"><input name="refSanmexx" value={data.refSanmexx} onChange={handleChange} className="w-full text-center uppercase" placeholder="..." /></td>
                 <td className="p-1"><input name="clienteFinal" value={data.clienteFinal} onChange={handleChange} className="w-full text-center uppercase" placeholder="..." /></td>
                 <td className="p-1"><input name="container" value={data.container} onChange={handleChange} className="w-full text-center uppercase" placeholder="..." /></td>
               </tr>
             </tbody>
           </table>
        </div>

        {/* OBSERVAÇÕES */}
        <div className="mb-8">
           <label className="font-bold">OBSERVAÇÕES GERAIS:</label>
           <textarea name="obs" value={data.obs} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded p-2 text-sm mt-1 resize-none" />
        </div>

        {/* ASSINATURAS */}
        <div className="grid grid-cols-2 gap-20 mt-12 pt-8">
           <div className="text-center">
              <div className="border-b border-black mb-2 h-1"></div>
              <p className="font-bold">SANMEXX LOGÍSTICA</p>
              <p className="text-[10px]">Contratante</p>
           </div>
           <div className="text-center">
              <div className="border-b border-black mb-2 h-1"></div>
              <p className="font-bold uppercase">{data.motoristaNome || 'MOTORISTA'}</p>
              <p className="text-[10px]">Contratado</p>
           </div>
        </div>

        <div className="mt-8 text-[10px] text-gray-400 text-center print:hidden">
          * Este documento deve ser conferido antes da assinatura.
        </div>

      </div>
    </div>
  );
}