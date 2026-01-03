'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getDadosImpressao } from '@/app/actions/documentoActions';
import { Loader2 } from 'lucide-react';

export default function PrintPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const tipo = searchParams.get('tipo');
  const remetenteId = searchParams.get('remetente');
  const destinatarioId = searchParams.get('destinatario');

  const [data, setData] = useState<any>(null);
  const [remetente, setRemetente] = useState<any>(null);
  const [destinatario, setDestinatario] = useState<any>(null);

  useEffect(() => {
    if (id) {
      getDadosImpressao(id).then(res => {
        setData(res);
        // Filtra remetente/destinatario se selecionado
        if (res?.parceiros) {
            if (remetenteId) setRemetente(res.parceiros.find((p:any) => p.id === remetenteId));
            if (destinatarioId) setDestinatario(res.parceiros.find((p:any) => p.id === destinatarioId));
        }
        // Auto-print após carregar (opcional)
        // setTimeout(() => window.print(), 1000); 
      });
    }
  }, [id, remetenteId, destinatarioId]);

  if (!data) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /> Carregando Documento...</div>;

  const { processo, cliente, veiculo } = data;

  // --- LAYOUT 1: MINUTA DE COLETA (RETIRADA VAZIO) ---
  if (tipo === 'minuta_coleta') {
    return (
      <div className="print-container bg-white text-black p-8 max-w-[210mm] mx-auto text-xs font-sans leading-tight">
        {/* CABEÇALHO */}
        <div className="border border-black mb-4">
             <div className="flex border-b border-black">
                <div className="w-2/3 p-2 border-r border-black">
                    <h1 className="text-lg font-bold">SANMEXX SOLUÇÃO EM TRANSPORTE E LOGÍSTICA</h1>
                    <p>CNPJ: 60.971.100/0001-97 - IE: 154.166.413.110</p>
                    <p>Rua Visconde de Embaré, 230 - Bairro Valongo - Santos/SP</p>
                </div>
                <div className="w-1/3">
                    <div className="border-b border-black p-1 bg-slate-100 font-bold text-center">MINUTA DE RETIRADA DE CONTAINER</div>
                    <div className="grid grid-cols-2 h-full">
                        <div className="border-r border-black p-1">
                            <span className="block font-bold">Nº PROCESSO</span>
                            <span className="text-red-600 font-bold text-sm">{processo.refSanmexx}</span>
                        </div>
                        <div className="p-1">
                             <span className="block font-bold">Nº RESERVA</span>
                             <span className="text-lg font-bold">{processo.booking || '-'}</span>
                        </div>
                    </div>
                </div>
             </div>
             
             {/* DADOS DO PROCESSO */}
             <div className="bg-slate-200 font-bold text-center border-b border-black p-1">DADOS DO PROCESSO</div>
             <div className="grid grid-cols-2 border-b border-black">
                <div className="p-1 border-r border-black">CLIENTE: {processo.clienteNome}</div>
                <div className="p-1">CNPJ: {cliente?.cnpj}</div>
             </div>
             <div className="grid grid-cols-4 border-b border-black">
                 <div className="p-1 border-r border-black col-span-2">TIPO: {processo.operacao}</div>
                 <div className="p-1 border-r border-black">DATA LIMITE: -</div>
                 <div className="p-1">Nº DI/DTA: {processo.documentoTransporte}</div>
             </div>
             <div className="grid grid-cols-2 border-b border-black">
                 <div className="p-1 border-r border-black">AGÊNCIA: {processo.agenteCargas || '-'}</div>
                 <div className="p-1">ARMADOR: {processo.armador || '-'}</div>
             </div>
             <div className="grid grid-cols-2 border-b border-black">
                 <div className="p-1 border-r border-black">PORTO ORIGEM: {processo.portoOrigem || '-'}</div>
                 <div className="p-1">PORTO DESTINO: {processo.portoDestino || '-'}</div>
             </div>
             <div className="grid grid-cols-2">
                 <div className="p-1 border-r border-black">TERMINAL: {processo.terminal || '-'}</div>
                 <div className="p-1">NAVIO/VIAGEM: {processo.navio} / {processo.viagem}</div>
             </div>
        </div>

        {/* DADOS AGENDAMENTO */}
        <div className="border border-black mb-4">
             <div className="bg-slate-200 font-bold text-center border-b border-black p-1">DADOS DO AGENDAMENTO</div>
             <div className="grid grid-cols-3 border-b border-black">
                <div className="p-1 border-r border-black">
                    <span className="font-bold">DATA RETIRADA:</span><br/>
                    {processo.dataRetiradaVazio ? new Date(processo.dataRetiradaVazio).toLocaleString() : '-'}
                </div>
                <div className="p-1 border-r border-black col-span-2 text-center flex items-center justify-center font-bold text-red-600">
                    RETIRADA VAZIO DEPOT
                </div>
             </div>
             <div className="p-1 border-b border-black">
                 <span className="font-bold">LOCAL ORIGEM (DEPOT):</span> {processo.depot || 'Conforme Processo'}
             </div>
             
             <div className="grid grid-cols-2">
                 <div className="border-r border-black p-1">
                     <div className="font-bold border-b border-dashed mb-1">MOTORISTA</div>
                     <p>NOME: {veiculo?.motNome}</p>
                     <p>CPF: {veiculo?.motCPF} / CNH: {veiculo?.motCNH}</p>
                 </div>
                 <div className="p-1">
                     <div className="font-bold border-b border-dashed mb-1">VEÍCULO</div>
                     <p>PLACA CAVALO: {veiculo?.placaCavalo}</p>
                     <p>PLACA CARRETA: {veiculo?.placaCarreta}</p>
                     <p>MODELO: {veiculo?.modelo}</p>
                 </div>
             </div>
        </div>

        {/* DADOS CONTAINER */}
        <div className="border border-black">
            <div className="bg-slate-200 font-bold text-center border-b border-black p-1">DADOS DO CONTAINER</div>
            <div className="grid grid-cols-4 text-center">
                 <div className="p-2 border-r border-black">
                     <span className="block font-bold">Nº CONTAINER</span>
                     {processo.container || '________________'}
                 </div>
                 <div className="p-2 border-r border-black">
                     <span className="block font-bold">MODELO/TIPO</span>
                     {processo.tipoContainer || '________________'}
                 </div>
                 <div className="p-2 border-r border-black">
                     <span className="block font-bold">TARA</span>
                     {processo.tara || '__________'}
                 </div>
                 <div className="p-2">
                     <span className="block font-bold">LACRE</span>
                     {processo.lacre || '__________'}
                 </div>
            </div>
        </div>
        
        <div className="mt-4 text-center font-bold text-red-600">
            OBS: O MOTORISTA ESTÁ APTO A FAZER A VISTORIA
        </div>
      </div>
    );
  }

  // --- LAYOUT 2: MINUTA DE ENTREGA ---
  if (tipo === 'minuta_entrega') {
    return (
       <div className="print-container bg-white text-black p-8 max-w-[210mm] mx-auto text-xs font-sans">
          {/* HEADER SIMPLES */}
          <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-4">
               <div><h1 className="text-xl font-bold">SANMEXX</h1><p>CONTROLE DE ENTREGA E EMBARQUE</p></div>
               <div className="text-right"><h2 className="text-xl font-bold text-red-600">MINUTA Nº {processo.refSanmexx.split('/')[0].replace('TR-', '')}</h2></div>
          </div>

          <table className="w-full border border-black mb-6">
              <tbody>
                  <tr className="border-b border-black"><td className="p-1 font-bold border-r border-black w-32">CLIENTE</td><td className="p-1">{processo.clienteNome}</td></tr>
                  <tr className="border-b border-black"><td className="p-1 font-bold border-r border-black">BOOKING/DI</td><td className="p-1">{processo.booking || processo.documentoTransporte}</td></tr>
                  <tr className="border-b border-black"><td className="p-1 font-bold border-r border-black">NAVIO</td><td className="p-1">{processo.navio}</td></tr>
                  <tr className="border-b border-black"><td className="p-1 font-bold border-r border-black">MOTORISTA</td><td className="p-1 uppercase">{veiculo?.motNome}</td></tr>
                  <tr className="border-b border-black"><td className="p-1 font-bold border-r border-black">DEPOT/TERMINAL</td><td className="p-1">{processo.terminal || processo.depot}</td></tr>
              </tbody>
          </table>

          {/* DADOS EXTRAS */}
          <div className="grid grid-cols-4 border border-black mb-6 text-center">
              <div className="p-1 border-r border-black"><span className="block font-bold">CPF</span>{veiculo?.motCPF}</div>
              <div className="p-1 border-r border-black"><span className="block font-bold">CNH</span>{veiculo?.motCNH}</div>
              <div className="p-1 border-r border-black"><span className="block font-bold">PLACA CAVALO</span>{veiculo?.placaCavalo}</div>
              <div className="p-1"><span className="block font-bold">PLACA REBOQUE</span>{veiculo?.placaCarreta}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 border border-black p-4 mb-6">
               <div>
                   <span className="font-bold">CONTAINER:</span> {processo.container}<br/>
                   <span className="font-bold">TIPO:</span> {processo.tipoContainer}<br/>
                   <span className="font-bold">LACRE:</span> {processo.lacre}
               </div>
               <div>
                   <span className="font-bold">ARMADOR:</span> {processo.armador}<br/>
                   <span className="font-bold">TEMPERATURA:</span> {processo.temperatura || '-'}<br/>
                   <span className="font-bold">OPERAÇÃO:</span> {processo.operacao}
               </div>
          </div>

          {/* ÁREA DE AVARIAS (A CRUZ) */}
          <div className="border border-black p-4 h-64 relative">
              <div className="absolute top-2 left-2 text-xs font-bold w-4">AVARIAS</div>
              <div className="flex justify-center items-center h-full">
                  {/* DESENHO DA CRUZ DE VISTORIA */}
                  <div className="relative w-40 h-32">
                      <div className="absolute top-0 left-10 w-20 h-10 border border-black bg-white"></div> {/* Teto */}
                      <div className="absolute bottom-0 left-10 w-20 h-10 border border-black bg-white"></div> {/* Chão */}
                      <div className="absolute top-10 left-0 w-10 h-12 border border-black bg-white"></div> {/* Esq */}
                      <div className="absolute top-10 right-0 w-10 h-12 border border-black bg-white"></div> {/* Dir */}
                      <div className="absolute top-10 left-10 w-20 h-12 border border-black bg-white flex items-center justify-center text-xs text-slate-300">FUNDO</div>
                  </div>
                  
                  {/* LISTA DE OPÇÕES */}
                  <div className="ml-10 text-xs space-y-1">
                      <div>[ ] 1. AMASSADO</div>
                      <div>[ ] 2. ARRANHADO</div>
                      <div>[ ] 3. CORTADO</div>
                      <div>[ ] 4. ENFERRUJADO</div>
                      <div>[ ] 5. FURADO</div>
                      <div>[ ] 6. REMENDADO</div>
                      <div>[ ] 7. SEM LACRE</div>
                  </div>
              </div>
          </div>
          
          <div className="mt-4 border-t border-black pt-4 flex justify-between">
             <div className="w-1/3 text-center border-t border-black pt-2">RESPONSÁVEL SANMEXX</div>
             <div className="w-1/3 text-center border-t border-black pt-2">ASSINATURA MOTORISTA</div>
          </div>
       </div>
    );
  }

  // --- LAYOUT 3: ORDEM DE COLETA ---
  if (tipo === 'ordem_coleta') {
    return (
       <div className="print-container bg-white text-black p-6 max-w-[210mm] mx-auto text-xs font-sans leading-snug">
           <div className="text-center mb-4 font-bold border-b border-black pb-2">
               <h1 className="text-lg">ORDEM DE COLETA</h1>
               <p className="text-red-600">REF: {processo.refSanmexx}</p>
           </div>
           
           <div className="grid grid-cols-2 gap-0 border border-black">
               {/* REMETENTE */}
               <div className="p-2 border-r border-black border-b border-black">
                   <span className="font-bold block">REMETENTE:</span>
                   {remetente ? (
                       <>
                           <p>{remetente.razaoSocial}</p>
                           <p>{remetente.endereco} - {remetente.bairro}</p>
                           <p>{remetente.cidade}/{remetente.uf}</p>
                           <p>CNPJ: {remetente.cnpj}</p>
                       </>
                   ) : <span className="text-slate-400 italic">(Não selecionado)</span>}
               </div>
               
               {/* DESTINATÁRIO */}
               <div className="p-2 border-b border-black">
                   <span className="font-bold block">DESTINATÁRIO:</span>
                   {destinatario ? (
                       <>
                           <p>{destinatario.razaoSocial}</p>
                           <p>{destinatario.endereco} - {destinatario.bairro}</p>
                           <p>{destinatario.cidade}/{destinatario.uf}</p>
                           <p>CNPJ: {destinatario.cnpj}</p>
                       </>
                   ) : <span className="text-slate-400 italic">(Não selecionado)</span>}
               </div>

               {/* LOCAIS OPERACIONAIS */}
               <div className="p-2 border-r border-black border-b border-black">
                   <span className="font-bold block">LOCAL DE COLETA:</span>
                   <p>{processo.localColeta || processo.depot || '-'}</p>
                   <p className="mt-1 font-bold">DATA COLETA: {processo.dataColetaCarga ? new Date(processo.dataColetaCarga).toLocaleString() : '-'}</p>
               </div>
               <div className="p-2 border-b border-black">
                   <span className="font-bold block">LOCAL DE ENTREGA:</span>
                   <p>{processo.terminal || processo.portoDestino || '-'}</p>
                   <p className="mt-1 font-bold">DATA ENTREGA: {processo.dataEntregaFinal ? new Date(processo.dataEntregaFinal).toLocaleString() : '-'}</p>
               </div>
           </div>

           {/* MERCADORIA */}
           <div className="border-l border-r border-b border-black p-2">
               <div className="grid grid-cols-4">
                   <div><span className="font-bold">MERCADORIA:</span> {processo.mercadoria}</div>
                   <div><span className="font-bold">PESO BRUTO:</span> {processo.pesoBruto}</div>
                   <div><span className="font-bold">QTD/EMB:</span> {processo.quantidade} {processo.embalagem}</div>
                   <div><span className="font-bold">VALOR:</span> R$ {processo.valorNf || '-'}</div>
               </div>
           </div>

           {/* MOTORISTA / VEICULO */}
           <div className="border-l border-r border-b border-black p-2 bg-slate-100 font-bold">DADOS DO TRANSPORTE</div>
           <div className="border-l border-r border-b border-black p-2 grid grid-cols-3">
               <div><span className="font-bold">MOTORISTA:</span> {veiculo?.motNome}</div>
               <div><span className="font-bold">CPF:</span> {veiculo?.motCPF}</div>
               <div><span className="font-bold">CNH:</span> {veiculo?.motCNH}</div>
               <div><span className="font-bold">VEÍCULO:</span> {veiculo?.modelo}</div>
               <div><span className="font-bold">PLACA:</span> {veiculo?.placaCavalo} / {veiculo?.placaCarreta}</div>
               <div><span className="font-bold">TIPO:</span> {veiculo?.tipoVeiculo}</div>
           </div>

           <div className="border-l border-r border-b border-black p-2">
               <span className="font-bold block mb-1">OBSERVAÇÕES:</span>
               <p className="min-h-[50px]">{processo.observacoes}</p>
           </div>
           
           <div className="mt-8 flex justify-between text-center">
               <div className="w-1/3 border-t border-black pt-2">DATA/HORA ENTRADA</div>
               <div className="w-1/3 border-t border-black pt-2">DATA/HORA SAÍDA</div>
               <div className="w-1/3 border-t border-black pt-2">ASSINATURA / CARIMBO</div>
           </div>
       </div>
    );
  }

  return <div>Layout não encontrado</div>;
}