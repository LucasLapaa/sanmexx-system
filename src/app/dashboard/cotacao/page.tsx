'use client';

import { useState, useEffect } from 'react';
import { Save, Calculator, FileText, CheckCircle, XCircle, Printer } from 'lucide-react';
import { getClientes } from '@/app/actions/getClientes';
import { saveCotacao, updateStatusCotacao } from '@/app/actions/saveCotacao';

// Texto padrão baseado na sua imagem
const TEXTO_PADRAO = `OBSERVAÇÕES GERAIS:
1. Retirada ou Entrega de CNTR (Guarujá): R$ 500,00 por operação.
2. Horas Paradas: Free Time de 4h. Excedente: Truck R$ 130,00/h, Carreta R$ 160,00/h.
3. Diária/Pernoite: R$ 600,00 o período. Estadia 24h: R$ 1.000,00.
4. Frete Morto: 50% se cancelado no dia anterior, 100% se veículo em deslocamento.
5. Nossa apólice tem cobertura máxima de R$ 500.000,00 por embarque.`;

export default function CotacaoPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estado do Formulário
  const [formData, setFormData] = useState({
    clienteId: '',
    clienteNome: '',
    clienteCnpj: '',
    clienteEndereco: '',
    rota: '',
    veiculo: 'Carreta',
    tipoCarga: 'Carga Geral',
    distanciaKm: 0,
    valorMercadoria: 0,
    freteValor: 0,
    tipoFrete: 'Frete Peso',
    pedagio: 0,
    adValoremPorc: 0,
    adValoremValor: 0,
    grisPorc: 0,
    grisValor: 0,
    despacho: 0,
    aet: 0,
    estacionamento: 0,
    taxaDta: 0,
    ajudante: 0,
    observacoes: TEXTO_PADRAO
  });

  // Carrega clientes ao abrir
  useEffect(() => {
    getClientes().then(setClientes);
  }, []);

  // Quando seleciona cliente, preenche endereço e CNPJ automaticamente
  const handleClienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const cliente = clientes.find(c => c.id === selectedId);
    
    if (cliente) {
      setFormData(prev => ({
        ...prev,
        clienteId: cliente.id,
        clienteNome: cliente.razaoSocial,
        clienteCnpj: cliente.cnpj,
        clienteEndereco: `${cliente.endereco || ''} - ${cliente.cidade || ''}/${cliente.uf || ''}`
      }));
    }
  };

  // Cálculos Automáticos (Ad Valorem e Gris)
  useEffect(() => {
    if (formData.valorMercadoria > 0) {
      const adValoremCalc = (formData.valorMercadoria * (formData.adValoremPorc / 100));
      const grisCalc = (formData.valorMercadoria * (formData.grisPorc / 100));
      
      setFormData(prev => ({
        ...prev,
        adValoremValor: parseFloat(adValoremCalc.toFixed(2)),
        grisValor: parseFloat(grisCalc.toFixed(2))
      }));
    }
  }, [formData.valorMercadoria, formData.adValoremPorc, formData.grisPorc]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Converte strings numéricas para float antes de enviar
    const payload = {
      ...formData,
      distanciaKm: Number(formData.distanciaKm),
      valorMercadoria: Number(formData.valorMercadoria),
      freteValor: Number(formData.freteValor),
      pedagio: Number(formData.pedagio),
      adValoremPorc: Number(formData.adValoremPorc),
      adValoremValor: Number(formData.adValoremValor),
      grisPorc: Number(formData.grisPorc),
      grisValor: Number(formData.grisValor),
      despacho: Number(formData.despacho),
      aet: Number(formData.aet),
      estacionamento: Number(formData.estacionamento),
      taxaDta: Number(formData.taxaDta),
      ajudante: Number(formData.ajudante),
    };

    const result = await saveCotacao(payload);
    setLoading(false);
    
    if (result.success) {
      alert(result.message);
      window.location.reload(); // Recarrega para mostrar na lista e limpar form
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* --- FORMULÁRIO DE COTAÇÃO --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-6 text-blue-800 pb-2 border-b border-blue-100">
          <Calculator size={24} />
          <h1 className="text-2xl font-bold">Nova Cotação</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. CLIENTE E ROTA */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
              <select onChange={handleClienteChange} className="w-full p-2 border rounded-lg bg-slate-50">
                <option value="">Selecione um cliente...</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.razaoSocial}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ</label>
              <input type="text" value={formData.clienteCnpj} readOnly className="w-full p-2 border rounded-lg bg-slate-100" />
            </div>
            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
              <input type="text" value={formData.clienteEndereco} readOnly className="w-full p-2 border rounded-lg bg-slate-100" />
            </div>

            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Rota (Origem x Destino)</label>
              <input type="text" name="rota" onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Ex: Santos x São Paulo" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Distância (KM)</label>
              <input type="number" name="distanciaKm" onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Veículo</label>
              <select name="veiculo" onChange={handleChange} className="w-full p-2 border rounded-lg">
                <option>Fiorino</option>
                <option>Utilitário</option>
                <option>Baú 3/4</option>
                <option>Toco</option>
                <option>Truck</option>
                <option>Bitruck</option>
                <option>Sider</option>
                <option>Carreta</option>
                <option>Porta CNT 20'</option>
                <option>Porta CNT 40'</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo Carga</label>
              <select name="tipoCarga" onChange={handleChange} className="w-full p-2 border rounded-lg">
                <option>Carga Geral</option>
                <option>Alimento</option>
                <option>Excedente</option>
                <option>Perigosa (IMO)</option>
              </select>
            </div>
          </div>

          {/* 2. VALORES E CÁLCULOS */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
             <h3 className="font-bold text-slate-700 mb-4">Composição de Frete</h3>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">Valor Mercadoria (R$)</label>
                  <input type="number" name="valorMercadoria" onChange={handleChange} className="w-full p-2 border rounded border-blue-300" placeholder="0.00" />
                </div>
                
                <div>
                   <label className="block text-sm font-medium text-slate-700">Ad Valorem (%)</label>
                   <div className="flex gap-2">
                     <input type="number" name="adValoremPorc" onChange={handleChange} className="w-20 p-2 border rounded" placeholder="%" />
                     <input type="number" value={formData.adValoremValor} readOnly className="w-full p-2 border rounded bg-gray-100" />
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700">Gris (%)</label>
                   <div className="flex gap-2">
                     <input type="number" name="grisPorc" onChange={handleChange} className="w-20 p-2 border rounded" placeholder="%" />
                     <input type="number" value={formData.grisValor} readOnly className="w-full p-2 border rounded bg-gray-100" />
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Pedágio (R$)</label>
                  <input type="number" name="pedagio" onChange={handleChange} className="w-full p-2 border rounded" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Frete (Valor Base)</label>
                  <div className="flex gap-2">
                    <select name="tipoFrete" onChange={handleChange} className="p-2 border rounded bg-white">
                        <option>Frete Peso</option>
                        <option>Frete All In</option>
                    </select>
                    <input type="number" name="freteValor" onChange={handleChange} className="w-full p-2 border rounded font-bold text-lg text-green-700" placeholder="0.00" />
                  </div>
                </div>

                {/* TAXAS EXTRAS */}
                <div><label className="text-xs">Despacho</label><input type="number" name="despacho" onChange={handleChange} className="w-full p-1 border rounded" /></div>
                <div><label className="text-xs">AET (Excesso)</label><input type="number" name="aet" onChange={handleChange} className="w-full p-1 border rounded" /></div>
                <div><label className="text-xs">Estacionamento</label><input type="number" name="estacionamento" onChange={handleChange} className="w-full p-1 border rounded" /></div>
                <div><label className="text-xs">Taxa DTA</label><input type="number" name="taxaDta" onChange={handleChange} className="w-full p-1 border rounded" /></div>
                <div><label className="text-xs">Ajudante</label><input type="number" name="ajudante" onChange={handleChange} className="w-full p-1 border rounded" /></div>
             </div>
          </div>

          {/* 3. OBSERVAÇÕES E BOTÃO SALVAR */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Informações Adicionais (Editável)</label>
            <textarea 
                name="observacoes" 
                value={formData.observacoes} 
                onChange={handleChange} 
                rows={5}
                className="w-full p-3 border rounded-lg text-sm text-slate-600 font-mono bg-yellow-50"
            />
          </div>

          <div className="flex justify-end">
            <button disabled={loading} className="flex items-center gap-2 bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 font-bold shadow-lg">
                <Save size={20} />
                Gerar Cotação
            </button>
          </div>
        </form>
      </div>

      {/* --- LISTA DE COTAÇÕES (Histórico) --- */}
      {/* Em um cenário real, buscaríamos do banco com outra Server Action. 
          Aqui deixo a estrutura pronta para quando formos listar. */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h2 className="font-bold text-slate-700">Últimas Cotações</h2>
        </div>
        <div className="p-8 text-center text-slate-400">
            <FileText size={48} className="mx-auto mb-2 opacity-50" />
            <p>As cotações salvas aparecerão aqui com opção de Aprovar/Reprovar.</p>
        </div>
      </div>

    </div>
  );
}