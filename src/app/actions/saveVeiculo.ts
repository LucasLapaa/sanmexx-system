'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveVeiculo(data: any) {
  try {
    // Verifica se a placa do cavalo já existe para evitar duplicidade
    const existing = await prisma.veiculo.findFirst({
      where: { placaCavalo: data.placaCavalo } as any
    });

    if (existing) {
      return { success: false, message: 'Erro: Já existe um veículo com esta Placa (Cavalo).' };
    }

    await prisma.veiculo.create({
      data: {
        propNome: data.propNome,
        propCNH: data.propCNH,
        propVencimento: data.propVencimento,
        propCPF: data.propCPF,
        propRG: data.propRG,
        propTelefone: data.propTelefone,

        tipoVeiculo: data.tipoVeiculo,
        placaCavalo: data.placaCavalo,
        placaCarreta: data.placaCarreta,
        modelo: data.modelo,
        cor: data.cor,
        tara: data.tara,
        tamanho: data.tamanho,
        chassiCavalo: data.chassiCavalo,
        renavamCavalo: data.renavamCavalo,
        chassiCarreta: data.chassiCarreta,
        renavamCarreta: data.renavamCarreta,

        motNome: data.motNome,
        motTelefone: data.motTelefone,
        motCPF: data.motCPF,
        motRG: data.motRG,
        motCNH: data.motCNH,
        motVencimento: data.motVencimento,
      } as any
    });

    revalidatePath('/dashboard/cadastro/veiculo');
    return { success: true, message: 'Veículo cadastrado com sucesso!' };

  } catch (error) {
    console.error(error);
    return { success: false, message: 'Erro interno ao salvar veículo.' };
  }
}