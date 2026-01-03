'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function savePorto(data: { nome: string; pais: string }) {
  try {
    // Verifica se já existe um porto com esse nome nesse país
    const existing = await prisma.porto.findFirst({
      where: { 
        nome: data.nome,
        pais: data.pais
      }
    });

    if (existing) {
      return { success: false, message: 'Este Porto já está cadastrado neste País.' };
    }

    await prisma.porto.create({
      data: {
        nome: data.nome,
        pais: data.pais,
      }
    });

    revalidatePath('/dashboard/cadastro/porto');
    return { success: true, message: 'Porto cadastrado com sucesso!' };

  } catch (error) {
    console.error('Erro ao salvar porto:', error);
    return { success: false, message: 'Erro interno ao salvar.' };
  }
}