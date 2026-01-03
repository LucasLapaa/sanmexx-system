'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveCotacao(data: any) {
  try {
    // 1. GERAR NÚMERO AUTOMÁTICO (Cxxxx/xx)
    const anoAtual = new Date().getFullYear().toString().slice(-2); // Ex: "26"
    
    // Conta quantas cotações já existem neste ano para gerar a sequencia
    const count = await prisma.cotacao.count({
      where: {
        numero: { endsWith: `/${anoAtual}` }
      }
    });

    const sequencia = (count + 1).toString().padStart(4, '0'); // Ex: 0001
    const numeroGerado = `C${sequencia}/${anoAtual}`;

    // 2. SALVAR NO BANCO
    await prisma.cotacao.create({
      data: {
        numero: numeroGerado,
        ...data // Espalha os dados do formulário
      }
    });

    revalidatePath('/dashboard/cotacao');
    return { success: true, message: `Cotação ${numeroGerado} salva com sucesso!` };

  } catch (error) {
    console.error('Erro ao salvar cotação:', error);
    return { success: false, message: 'Erro interno ao salvar cotação.' };
  }
}

// Função extra para atualizar Status (Aprovado/Reprovado)
export async function updateStatusCotacao(id: string, novoStatus: string) {
  try {
    await prisma.cotacao.update({
      where: { id },
      data: { status: novoStatus }
    });
    revalidatePath('/dashboard/cotacao');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}