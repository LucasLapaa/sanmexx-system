'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface OrigemDestinoData {
  cidade: string;
  estado: string;
}

export async function saveOrigemDestino(data: OrigemDestinoData) {
  try {
    // Verifica se já existe essa combinação
    const existing = await prisma.origemDestino.findFirst({
      where: {
        cidade: data.cidade,
        estado: data.estado
      }
    });

    if (existing) {
      return { success: false, message: 'Esta Cidade/Estado já está cadastrada.' };
    }

    await prisma.origemDestino.create({
      data: {
        cidade: data.cidade,
        estado: data.estado,
      }
    });

    revalidatePath('/dashboard/cadastro/origem-destino');
    return { success: true, message: 'Localidade cadastrada com sucesso!' };

  } catch (error) {
    console.error('Erro ao salvar localidade:', error);
    return { success: false, message: 'Erro interno ao salvar.' };
  }
}