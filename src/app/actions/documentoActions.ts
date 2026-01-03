'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// 1. Busca dados completos para impressão
export async function getDadosImpressao(processoId: string) {
  const processo = await prisma.processo.findUnique({
    where: { id: processoId },
  });

  if (!processo) return null;

  const cliente = await prisma.cliente.findUnique({ where: { id: processo.clienteId } });
  
  let veiculo1 = null;
  if (processo.motorista1Id) {
    veiculo1 = await prisma.veiculo.findUnique({ where: { id: processo.motorista1Id } });
  } else if (processo.cavalo1Id) {
     veiculo1 = await prisma.veiculo.findUnique({ where: { id: processo.cavalo1Id } });
  }

  // Busca lista de parceiros para o dropdown
  const empresas = await prisma.cliente.findMany({ select: { id: true, razaoSocial: true, endereco: true, cidade: true, cnpj: true, bairro: true, uf: true } });
  const terminais = await prisma.terminal.findMany({ select: { id: true, razaoSocial: true, endereco: true, cidade: true, cnpj: true, bairro: true, uf: true } });
  
  const parceiros = [...empresas, ...terminais].map(e => ({
    ...e,
    tipo: 'EMPRESA'
  }));

  return {
    processo,
    cliente,
    veiculo: veiculo1,
    parceiros
  };
}

// 2. NOVA FUNÇÃO: Salvar Remetente e Destinatário no Banco
export async function salvarRemetenteDestinatario(processoId: string, remetenteId: string, destinatarioId: string) {
  try {
    await prisma.processo.update({
      where: { id: processoId },
      data: {
        remetenteId: remetenteId || null,
        destinatarioId: destinatarioId || null
      }
    });
    
    // Atualiza a tela de documentos para refletir a mudança
    revalidatePath('/dashboard/documentos');
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar opções de documento:", error);
    return { success: false };
  }
}