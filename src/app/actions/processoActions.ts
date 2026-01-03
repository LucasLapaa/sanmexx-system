'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- 1. CRIAR NOVO PROCESSO ---
export async function createProcesso(formData: FormData) {
  const clienteId = formData.get('clienteId') as string;
  const refCliente = formData.get('refCliente') as string;

  if (!clienteId) return { success: false, message: 'Cliente é obrigatório' };

  const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
  if (!cliente) return { success: false, message: 'Cliente não encontrado' };

  // Gera número TR-XXXXX/XX
  const anoAtual = new Date().getFullYear().toString().slice(-2);
  const count = await prisma.processo.count({
    where: { refSanmexx: { endsWith: `/${anoAtual}` } }
  });
  const sequencia = (count + 1).toString().padStart(5, '0');
  const refSanmexx = `TR-${sequencia}/${anoAtual}`;

  const novoProcesso = await prisma.processo.create({
    data: {
      refSanmexx,
      ordemColeta: refSanmexx,
      refCliente,
      clienteId: cliente.id,
      clienteNome: cliente.razaoSocial,
      operacao: 'IMPORTAÇÃO', // Valor padrão
      tipoCarregamento: 'CONTAINER' // Valor padrão
    }
  });

  redirect(`/dashboard/processos/${novoProcesso.id}`);
}

// --- 2. ATUALIZAR PROCESSO (Operacional) ---
export async function updateProcesso(id: string, data: any) {
  try {
    // Lógica automática de Status
    let status = "EM ANDAMENTO";
    if (data.operacao === 'IMPORTAÇÃO') {
      if (data.dataDevolucaoVazio) status = "FINALIZADO";
    } else {
      if (data.dataEntregaFinal) status = "FINALIZADO";
    }

    await prisma.processo.update({
      where: { id },
      data: { ...data, status }
    });

    revalidatePath('/dashboard/processos');
    revalidatePath(`/dashboard/processos/${id}`);
    return { success: true, message: 'Dados operacionais salvos com sucesso!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Erro ao salvar dados.' };
  }
}

// --- 3. EXCLUIR PROCESSO ---
export async function deleteProcesso(id: string) {
    await prisma.processo.delete({ where: { id } });
    revalidatePath('/dashboard/processos');
}

// --- 4. BUSCAR LISTAS SUSPENSAS (Auxiliar) ---
export async function getDadosAuxiliares() {
  const clientes = await prisma.cliente.findMany({ select: { id: true, razaoSocial: true } });
  const navios = await prisma.navio.findMany({ select: { nome: true } });
  const portos = await prisma.porto.findMany({ select: { nome: true } });
  const origensDestinos = await prisma.origemDestino.findMany();
  const veiculos = await prisma.veiculo.findMany(); // Traz tudo para montar placa + modelo
  const terminais = await prisma.terminal.findMany({ select: { id: true, razaoSocial: true } });
  const depots = await prisma.depot.findMany({ select: { id: true, razaoSocial: true } });
  const armadores = await prisma.armador.findMany({ select: { id: true, razaoSocial: true } });
  const agentes = await prisma.agenteCargas.findMany({ select: { id: true, razaoSocial: true } });
  
  return { clientes, navios, portos, origensDestinos, veiculos, terminais, depots, armadores, agentes };
}

// --- 5. BUSCAR PROCESSOS (Para a Lista Inicial) ---
export async function getProcessos(query: string = '') {
  return await prisma.processo.findMany({
    where: {
      OR: [
        { refSanmexx: { contains: query } },
        { clienteNome: { contains: query } },
        { container: { contains: query } },
        { booking: { contains: query } },
        { blMaster: { contains: query } },
        { refCliente: { contains: query } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });
}

// --- 6. BUSCAR PROCESSO ÚNICO COM FINANCEIRO ---
export async function getProcessoUnico(id: string) {
  return await prisma.processo.findUnique({
    where: { id },
    include: { itensFinanceiros: true } // Traz os itens de Compra/Venda junto
  });
}

// --- 7. IMPORTAR COTAÇÃO PARA VENDA ---
export async function importarCotacaoAction(processoId: string, numeroCotacao: string) {
  try {
    const cotacao = await prisma.cotacao.findUnique({ where: { numero: numeroCotacao } });
    
    if (!cotacao) return { success: false, message: 'Cotação não encontrada!' };

    // Limpa itens de VENDA antigos
    await prisma.itemFinanceiro.deleteMany({
      where: { processoId, tipo: 'VENDA' }
    });

    // Prepara os novos itens baseados na cotação
    const itensVenda = [
      { nome: 'FRETE PESO', valor: cotacao.freteValor || 0 },
      { nome: 'PEDÁGIO', valor: cotacao.pedagio || 0 },
      { nome: 'DESPACHO', valor: cotacao.despacho || 0 },
      { nome: 'SEGURO', valor: (cotacao.adValoremValor || 0) + (cotacao.grisValor || 0) },
      { nome: 'OUTROS', valor: (cotacao.aet || 0) + (cotacao.estacionamento || 0) + (cotacao.taxaDta || 0) + (cotacao.ajudante || 0) },
      { nome: 'MARGEM ESQUERDA', valor: 0 },
      { nome: 'PRE-STACKING', valor: 0 },
    ];

    // Salva um por um (seguro contra erros de versão do Prisma)
    for (const item of itensVenda) {
      if (item.valor > 0 || item.nome === 'FRETE PESO') {
        await prisma.itemFinanceiro.create({
          data: { processoId, tipo: 'VENDA', nome: item.nome, valor: item.valor }
        });
      }
    }

    revalidatePath(`/dashboard/processos/${processoId}`);
    return { success: true, message: 'Valores importados com sucesso!' };

  } catch (error) {
    console.error(error);
    return { success: false, message: 'Erro ao importar cotação.' };
  }
}

// --- 8. SALVAR GRID FINANCEIRO (CORRIGIDO) ---
export async function salvarFinanceiroAction(processoId: string, itens: any[]) {
  try {
    // 1. Limpa o financeiro atual desse processo
    await prisma.itemFinanceiro.deleteMany({ where: { processoId } });

    // 2. Salva os novos itens usando Promise.all (Substitui createMany que estava dando erro)
    await Promise.all(
      itens.map(item => 
        prisma.itemFinanceiro.create({
          data: {
            processoId,
            tipo: item.tipo,
            nome: item.nome,
            valor: Number(item.valor)
          }
        })
      )
    );

    revalidatePath(`/dashboard/processos/${processoId}`);
    return { success: true, message: 'Financeiro atualizado com sucesso!' };
  } catch (e) { 
    console.error(e);
    return { success: false, message: 'Erro ao salvar financeiro.' }; 
  }
}