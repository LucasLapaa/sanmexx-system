'use client';
import { Truck, Calendar, Anchor, AlertTriangle, FileText } from 'lucide-react';
import Link from 'next/link';

export default function OperationalPage() {
  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Controle Operacional</h1>
          <p className="text-slate-500">Gestão de Coletas, Minutas e Agendamentos</p>
        </div>
        <Link href="/dashboard/operacional/nova">
  <button className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition flex items-center gap-2 shadow-lg">
    <Truck size={20} />
    + Nova Ordem de Coleta
  </button>
</Link>
      </div>

      {/* Filtros Rápidos */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        <div className="bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm font-medium text-slate-700 whitespace-nowrap cursor-pointer hover:bg-blue-50 hover:border-blue-200">
          Todos (12)
        </div>
        <div className="bg-blue-100 px-6 py-3 rounded-full border border-blue-200 shadow-sm font-medium text-blue-800 whitespace-nowrap cursor-pointer">
          Agendados (3)
        </div>
        <div className="bg-yellow-100 px-6 py-3 rounded-full border border-yellow-200 shadow-sm font-medium text-yellow-800 whitespace-nowrap cursor-pointer">
          Em Trânsito (4)
        </div>
        <div className="bg-green-100 px-6 py-3 rounded-full border border-green-200 shadow-sm font-medium text-green-800 whitespace-nowrap cursor-pointer">
          Entregues (5)
        </div>
      </div>

      {/* Lista de Operações (Baseada nas Minutas e Ordens de Coleta) */}
      <div className="grid gap-6">
        
        {/* CARD 1: Exemplo baseado no PDF "ORDEM DE COLETA 00008/25" */}
        <div className="bg-white rounded-xl shadow-md border-l-4 border-yellow-500 overflow-hidden hover:shadow-xl transition-all">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded uppercase">Em Trânsito</span>
                <h3 className="text-xl font-bold text-slate-800 mt-2">Processo: 00008/25</h3>
                <p className="text-sm text-slate-500">Ref. Cliente: SSZ1723234</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-900">R$ 10.635,98</p>
                <p className="text-xs text-slate-400">Valor Total CTE</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              
              {/* Coluna Logística */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar size={16} className="text-blue-600" />
                  <span className="font-semibold">Coleta:</span> 12/12/2025 - 07:00h
                </div>
                <div className="pl-6 text-slate-500">
                  <p>Origem: Marcon Comércio (Piracicaba)</p>
                  <p>Destino: Tecon Guarujá (Santos Brasil)</p>
                </div>
              </div>

              {/* Coluna Marítima / Container */}
              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-slate-700">
                  <Anchor size={16} className="text-blue-600" />
                  <span className="font-semibold">Navio:</span> SWANSEA
                </div>
                <div className="pl-6 text-slate-500">
                  <p>Container: CMAU3181463 (20 DC)</p>
                  <p>Booking: 25/2350647-4</p>
                </div>
              </div>

              {/* Coluna Motorista */}
              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-slate-700">
                  <Truck size={16} className="text-blue-600" />
                  <span className="font-semibold">Motorista:</span> Ramon Luis
                </div>
                <div className="pl-6 text-slate-500">
                  <p>Placa: CPJ4F90 / BSG1091</p>
                  <p>CPF: 340.914.818-33</p>
                </div>
              </div>

            </div>

            {/* Rodapé do Card com Ações */}
            <div className="mt-6 pt-4 border-t flex justify-between items-center">
              <div className="flex gap-2">
                 <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Açúcar</span>
                 <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">27.000 kg</span>
              </div>
              <div className="flex gap-3">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                  <FileText size={16} /> Ver Minuta
                </button>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                  <FileText size={16} /> Ver Contrato
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Exemplo com Avarias (Baseado na Minuta de Importação) */}
        <div className="bg-white rounded-xl shadow-md border-l-4 border-green-500 overflow-hidden hover:shadow-xl transition-all">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded uppercase">Finalizado</span>
                <h3 className="text-xl font-bold text-slate-800 mt-2">Processo: 00018/25</h3>
                <p className="text-sm text-slate-500">Ref. Cliente: IMP-MAQ.EQ-CHI-0348</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-900">R$ 6.090,34</p>
                <p className="text-xs text-slate-400">Frete Peso</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar size={16} className="text-blue-600" />
                  <span className="font-semibold">Entrega:</span> 27/12/2025
                </div>
                <div className="pl-6 text-slate-500">
                  <p>Destino: Transtec World Santos</p>
                  <p>Cliente: Longping High-Tech</p>
                </div>
              </div>

              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-slate-700">
                  <Anchor size={16} className="text-blue-600" />
                  <span className="font-semibold">Navio:</span> MSC ELLEN
                </div>
                <div className="pl-6 text-slate-500">
                  <p>Container: MSMU 774214-2 (40 HC)</p>
                  <div className="flex items-center gap-1 text-red-500 mt-1">
                    <AlertTriangle size={12} />
                    <span className="text-xs font-bold">Avaria: Amassado / Sem Lacre</span>
                  </div>
                </div>
              </div>

               <div className="space-y-2">
                 <div className="flex items-center gap-2 text-slate-700">
                  <Truck size={16} className="text-blue-600" />
                  <span className="font-semibold">Motorista:</span> Tiago Farias
                </div>
                <div className="pl-6 text-slate-500">
                  <p>Placa: BSF-3577 / DPC-0999</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}