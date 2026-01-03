'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// 1. GERAR CONTA A RECEBER (Migrar do Processo)
export async function gerarContaReceberAction(processoId: string) {
  try {
    // Busca o processo com itens financeiros e cliente
    const processo = await prisma.processo.findUnique({
      where: { id: processoId },
      include: { 
        itensFinanceiros: true,
        contaReceber: true // Verifica se já existe (relação corrigida para singular conforme schema)
      }
    });

    if (!processo) return { success: false, message: 'Processo não encontrado.' };
    
    // Se já existe conta, bloqueia
    if (processo.contaReceber) return { success: false, message: 'Já existe uma fatura gerada para este processo.' };

    // Soma apenas os itens de VENDA
    const totalVenda = processo.itensFinanceiros
      .filter(i => i.tipo === 'VENDA')
      .reduce((acc, item) => acc + item.valor, 0);

    if (totalVenda <= 0) return { success: false, message: 'O processo não tem valores de VENDA lançados.' };

    // Busca dados do cliente para saber o prazo
    const cliente = await prisma.cliente.findUnique({ where: { id: processo.clienteId } });
    const diasPrazo = cliente?.diasPagamento || 15;

    // Calcula Vencimento
    const dataEmissao = new Date();
    const dataVencimento = new Date();
    dataVencimento.setDate(dataEmissao.getDate() + diasPrazo);

    // Gera Número Sequencial (Ex: 00001/26)
    const ano = new Date().getFullYear().toString().slice(-2);
    const count = await prisma.contaReceber.count({
      where: { numero: { endsWith: `/${ano}` } }
    });
    const sequencia = (count + 1).toString().padStart(5, '0');
    const numeroFatura = `${sequencia}/${ano}`;

    // Cria a conta
    await prisma.contaReceber.create({
      data: {
        numero: numeroFatura,
        processoId: processo.id,
        clienteId: processo.clienteId,
        valorTotal: totalVenda,
        dataEmissao: dataEmissao,
        dataVencimento: dataVencimento,
        status: 'PENDENTE'
      }
    });

    revalidatePath('/dashboard/financeiro/contas-a-receber');
    return { success: true, message: `Fatura ${numeroFatura} gerada com sucesso!` };

  } catch (error) {
    console.error(error);
    return { success: false, message: 'Erro ao gerar fatura.' };
  }
}

// 2. BUSCAR CONTAS
export async function getContasReceber(query: string = '') {
  return await prisma.contaReceber.findMany({
    where: {
      OR: [
        { numero: { contains: query } },
        { processo: { refSanmexx: { contains: query } } },
        { cliente: { razaoSocial: { contains: query } } }
      ]
    },
    include: {
      processo: true,
      cliente: true
    },
    orderBy: { dataVencimento: 'asc' }
  });
}

// 3. MARCAR COMO RECEBIDO
export async function receberContaAction(id: string) {
  await prisma.contaReceber.update({
    where: { id },
    data: { status: 'RECEBIDO' }
  });
  revalidatePath('/dashboard/financeiro/contas-a-receber');
}

// 4. ATUALIZAR INFORMAÇÕES COMPLEMENTARES
export async function updateInfoComplementar(id: string, texto: string) {
  await prisma.contaReceber.update({
    where: { id },
    data: { infoComplementar: texto }
  });
  revalidatePath('/dashboard/financeiro/contas-a-receber');
}

// 5. DADOS PARA IMPRESSÃO DA FATURA (CORRIGIDO)
export async function getDadosFatura(id: string) {
  const conta = await prisma.contaReceber.findUnique({
    where: { id },
    include: {
      cliente: true,
      processo: {
        include: {
          // AQUI ESTAVA O ERRO: Usamos 'where' direto dentro do include para filtrar
          itensFinanceiros: {
            where: { tipo: 'VENDA' }
          }
        }
      }
    }
  });
  return conta;
}