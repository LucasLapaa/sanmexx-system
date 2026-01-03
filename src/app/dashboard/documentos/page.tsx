'use client';

import { useState } from 'react';
import { Search, FileText, Printer, ArrowRight, Save, Loader2 } from 'lucide-react';
import { getDadosImpressao, salvarRemetenteDestinatario } from '@/app/actions/documentoActions';
import { getProcessos } from '@/app/actions/processoActions';

export default function DocumentosPage() {
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [selecionado, setSelecionado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Dados para Ordem de Coleta
  const [parceiros, setParceiros] = useState<any[]>([]);
  const [remetenteId, setRemetenteId] = useState('');
  const [destinatarioId, setDestinatarioId] = useState('');

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await getProcessos(busca);
    setResultados(res);
    setSelecionado(null);
    setLoading(false);
  };

  const handleSelecionar = async (proc: any) => {
    setLoading(true);
    const dados = await getDadosImpressao(proc.id);
    setSelecionado(dados);
    setParceiros(dados?.parceiros || []);
    
    // --- AQUI ESTÁ A MÁGICA: Carrega o que já estava salvo no banco ---
    if (dados?.processo) {
        setRemetenteId(dados.processo.remetenteId || '');
        setDestinatarioId(dados.processo.destinatarioId || '');
    }
    
    setLoading(false);
  };

  const abrirImpressao = async (tipo: string) => {
    if (!selecionado) return;

    // 1. Salva no banco antes de abrir (para garantir histórico)
    setSaving(true);
    await salvarRemetenteDestinatario(selecionado.processo.id, remetenteId, destinatarioId);
    setSaving(false);

    // 2. Abre a impressão
    const params = new URLSearchParams();
    params.set('id', selecionado.processo.id);
    params.set('tipo', tipo);
    if (remetenteId) params.set('remetente', remetenteId);
    if (destinatarioId) params.set('destinatario', destinatarioId);
    
    window.open(`/dashboard/documentos/print?${params.toString()}`, '_blank');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto pb-20">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Printer /> Emissão de Documentos
      </h1>

      {/* BUSCA */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
        <form onSubmit={handleBuscar} className="flex gap-4">
          <input 
            type="text" 
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Digite a Ref. Sanmexx ou Cliente..." 
            className="flex-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
            Buscar Processo
          </button>
        </form>

        {resultados.length > 0 && !selecionado && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-bold text-slate-500 mb-2">Selecione o Processo:</h3>
            <div className="space-y-2">
              {resultados.map(r => (
                <div key={r.id} onClick={() => handleSelecionar(r)} className="p-3 border rounded hover:bg-slate-50 cursor-pointer flex justify-between items-center group transition-colors">
                  <div>
                    <div className="font-bold text-blue-700">{r.refSanmexx}</div>
                    <div className="text-sm text-slate-500">{r.clienteNome}</div>
                  </div>
                  <ArrowRight className="text-slate-300 group-hover:text-blue-600" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ÁREA DE IMPRESSÃO */}
      {selecionado && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-start mb-6 border-b pb-4">
             <div>
               <h2 className="text-xl font-bold text-slate-800">Processo: {selecionado.processo.refSanmexx}</h2>
               <p className="text-slate-500">{selecionado.processo.operacao} - {selecionado.processo.clienteNome}</p>
             </div>
             <button onClick={() => setSelecionado(null)} className="text-sm text-red-500 hover:underline">Trocar Processo</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* CONFIGURAÇÃO */}
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 h-fit">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                 Configurar Ordem de Coleta
                 {saving && <span className="text-xs text-blue-600 font-normal animate-pulse">(Salvando...)</span>}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Remetente (Quem envia)</label>
                  <select 
                    className="w-full p-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-500" 
                    value={remetenteId}
                    onChange={e => setRemetenteId(e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {parceiros.map((p:any) => <option key={p.id} value={p.id}>{p.razaoSocial}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Destinatário (Quem recebe)</label>
                  <select 
                    className="w-full p-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-500" 
                    value={destinatarioId}
                    onChange={e => setDestinatarioId(e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {parceiros.map((p:any) => <option key={p.id} value={p.id}>{p.razaoSocial}</option>)}
                  </select>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4">* Estas opções ficarão salvas automaticamente ao gerar o documento.</p>
            </div>

            {/* BOTÕES */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-700 mb-3">Gerar Documento</h3>
              
              <button disabled={saving} onClick={() => abrirImpressao('minuta_coleta')} className="w-full flex items-center justify-between p-4 bg-white border border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group shadow-sm hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded text-blue-600"><FileText size={20} /></div>
                  <div className="text-left">
                    <div className="font-bold text-slate-700 group-hover:text-blue-800">Minuta de Coleta de Container</div>
                    <div className="text-xs text-slate-400">Para retirada de vazio no Depot</div>
                  </div>
                </div>
                {saving ? <Loader2 className="animate-spin text-blue-600" /> : <ArrowRight className="text-slate-300 group-hover:text-blue-600" />}
              </button>

              <button disabled={saving} onClick={() => abrirImpressao('minuta_entrega')} className="w-full flex items-center justify-between p-4 bg-white border border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group shadow-sm hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded text-blue-600"><FileText size={20} /></div>
                  <div className="text-left">
                    <div className="font-bold text-slate-700 group-hover:text-blue-800">Minuta de Entrega de Container</div>
                    <div className="text-xs text-slate-400">Controle de avarias e devolução</div>
                  </div>
                </div>
                {saving ? <Loader2 className="animate-spin text-blue-600" /> : <ArrowRight className="text-slate-300 group-hover:text-blue-600" />}
              </button>

              <button disabled={saving} onClick={() => abrirImpressao('ordem_coleta')} className="w-full flex items-center justify-between p-4 bg-white border border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group shadow-sm hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded text-blue-600"><FileText size={20} /></div>
                  <div className="text-left">
                    <div className="font-bold text-slate-700 group-hover:text-blue-800">Ordem de Coleta</div>
                    <div className="text-xs text-slate-400">Documento completo de transporte</div>
                  </div>
                </div>
                {saving ? <Loader2 className="animate-spin text-blue-600" /> : <ArrowRight className="text-slate-300 group-hover:text-blue-600" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}