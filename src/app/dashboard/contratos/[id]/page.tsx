'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'; // Importações novas
import { Printer, Save, ArrowLeft, Trash2 } from 'lucide-react';

export default function ContratoEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isEditing = id !== 'novo';

  const [loading, setLoading] = useState(isEditing);
  
  const [data, setData] = useState({
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
    
    // Valores
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

  // SE FOR EDIÇÃO, BUSCA OS DADOS
  useEffect(() => {
    if (isEditing) {
      fetch(`/api/contratos/${id}`)
        .then(res => res.json())
        .then(contrato => {
          if (contrato && contrato.dadosCompletos) {
            setData(contrato.dadosCompletos);
          }
          setLoading(false);
        });
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const calcularSaldo = () => {
    const creditos = Number(data.frete) + Number(data.pedagio) + Number(data.seguro) + Number(data.acrescimo);
    const debitos = Number(data.desconto) + Number(data.irrf) + Number(data.inss) + Number(data.sest) + Number(data.iss) + Number(data.adiantamento);
    return (creditos - debitos).toFixed(2);
  };

  const handleSave = async () => {
    const saldo = calcularSaldo();
    const payload = { ...data, saldoFinal: saldo };
    
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/contratos/${id}` : '/api/contratos';

    const res = await fetch(url, {
      method: method,
      body: JSON.stringify(payload)
    });

    if(res.ok) {
      alert(isEditing ? 'Contrato Atualizado!' : 'Contrato Criado!');
      if (!isEditing) router.push('/dashboard/contratos');
    } else {
      alert('Erro ao salvar');
    }
  };

  const handleDelete = async () => {
    if(!confirm('Tem certeza que deseja EXCLUIR este contrato?')) return;
    
    await fetch(`/api/contratos/${id}`, { method: 'DELETE' });
    router.push('/dashboard/contratos');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-8">Carregando dados...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center gap-6 print:p-0 print:bg-white">
      
      {/* BARRA DE AÇÕES */}
      <div className="w-full max-w-[210mm] flex justify-between items-center bg-white p-4 rounded-lg shadow-sm print:hidden border border-gray-200 mb-6 sticky top-4 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/contratos" className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <ArrowLeft />
          </Link>
          
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
          {isEditing && (
            <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition border border-red-200 font-semibold mr-4">
              <Trash2 size={18} /> Excluir
            </button>
          )}

          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition border border-blue-200 font-semibold">
            <Save size={18} /> {isEditing ? 'Atualizar' : 'Salvar'}
          </button>
          
          <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition shadow-md font-bold">
            <Printer size={18} /> Imprimir
          </button>
        </div>
      </div>

      {/* A FOLHA A4 (Conteúdo do Contrato) */}
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

        {/* MANTENHA O RESTANTE DO FORMULÁRIO IGUALZINHO COMO VOCÊ JÁ TINHA */}
        {/* ... DADOS CONTRATANTE, MOTORISTA, VEICULO, VALORES ... */}
        {/* Vou omitir aqui para economizar espaço, mas você deve manter o código do "papel" que já fizemos antes */}
        
        <div className="mb-4 border border-black p-2 rounded-sm bg-gray-50 print:bg-transparent">
             {/* ... Coloque o resto do seu HTML do contrato aqui ... */}
             {/* Se precisar que eu reenvie o HTML do contrato inteiro, me avise! */}
             <div className="text-center p-10 text-gray-400">
               (Mantenha aqui o conteúdo do formulário que fizemos no passo anterior)
             </div>
        </div>

      </div>
    </div>
  );
}