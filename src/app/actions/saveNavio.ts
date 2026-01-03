'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveNavio(formData: FormData) {
  const nome = formData.get('nome') as string;

  if (!nome) {
    return { success: false, message: 'O nome do navio é obrigatório.' };
  }

  try {
    // Verifica se já existe
    const existing = await prisma.navio.findFirst({
      where: { nome: nome }
    });

    if (existing) {
      return { success: false, message: 'Este navio já está cadastrado no sistema.' };
    }

    // Salva
    await prisma.navio.create({
      data: { nome }
    });

    revalidatePath('/dashboard/cadastro/navio');
    return { success: true, message: 'Navio cadastrado com sucesso!' };

  } catch (error) {
    console.error('Erro ao salvar navio:', error);
    return { success: false, message: 'Erro interno ao salvar.' };
  }
}