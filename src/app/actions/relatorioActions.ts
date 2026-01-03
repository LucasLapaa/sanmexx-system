'use server';

import { prisma } from '@/lib/prisma';

// --- 1. RELATÓRIO OPERACIONAL ---
// Filtra processos por Período, Cliente e Operação
export async function getRelatorioOperacional(filtros: any) {
  const { dataInicio, dataFim, clienteId, operacao } = filtros;

  // Monta o filtro dinâmico
  const where: any = {};

  // Filtro de Data (Baseado na Data de Abertura)
  if (dataInicio && dataFim) {
    where.dataAbertura = {
      gte: new Date(dataInicio + 'T00:00:00.000Z'),
      lte: new Date(dataFim + 'T23:59:59.999Z'),
    };
  }

  if (clienteId) where.clienteId = clienteId;
  if (operacao) where.operacao = operacao;

  // Busca os processos com todos os detalhes
  const processos = await prisma.processo.findMany({
    where,
    include: {
      cliente: true,
      itensFinanceiros: true // Traz custos/vendas para resumo
    },
    orderBy: { refSanmexx: 'asc' }
  });

  return processos;
}

// --- 2. RELATÓRIO FINANCEIRO ---
// Traz Contas a Pagar (PAGO) e Contas a Receber (RECEBIDO)
export async function getRelatorioFinanceiro(filtros: any) {
  const { dataInicio, dataFim, processoRef } = filtros;

  const wherePeriodo: any = {};
  
  // Filtro de Data
  if (dataInicio && dataFim) {
    const periodo = {
      gte: new Date(dataInicio + 'T00:00:00.000Z'),
      lte: new Date(dataFim + 'T23:59:59.999Z'),
    };
    // Para pagar usa Data Pagamento, para receber usa Data Emissão (ou Vencimento, conforme preferir)
    // Aqui aplicaremos dinamicamente nas queries abaixo
  }

  // Filtro de Processo (Texto)
  const filtroProcesso = processoRef ? { processoRef: { contains: processoRef } } : {};
  const filtroProcessoReceber = processoRef ? { processo: { refSanmexx: { contains: processoRef } } } : {};

  // 1. Busca Saídas (Pagamentos Realizados)
  const saidas = await prisma.solicitacaoPagamento.findMany({
    where: {
      status: 'PAGO',
      ...(dataInicio && dataFim ? { dataPagamento: { gte: new Date(dataInicio), lte: new Date(dataFim + 'T23:59:59') } } : {}),
      ...filtroProcesso
    },
    orderBy: { dataPagamento: 'asc' }
  });

  // 2. Busca Entradas (Recebimentos Realizados)
  const entradas = await prisma.contaReceber.findMany({
    where: {
      status: 'RECEBIDO',
      ...(dataInicio && dataFim ? { dataEmissao: { gte: new Date(dataInicio), lte: new Date(dataFim + 'T23:59:59') } } : {}),
      ...filtroProcessoReceber
    },
    include: { processo: true, cliente: true },
    orderBy: { dataEmissao: 'asc' }
  });

  // Calcula Totais
  const totalSaidas = saidas.reduce((acc, item) => acc + item.valor, 0);
  const totalEntradas = entradas.reduce((acc, item) => acc + item.valorTotal, 0);
  const saldo = totalEntradas - totalSaidas;

  return { saidas, entradas, resumo: { totalSaidas, totalEntradas, saldo } };
}