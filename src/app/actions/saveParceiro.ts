'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Tipos permitidos para essa função
type TipoParceiro = 'terminal' | 'depot' | 'agente_cargas' | 'armador' | 'exportador';

interface ParceiroData {
  tipo: TipoParceiro;
  codigo: string;
  razaoSocial: string;
  cnpj: string;
  planta: string;
  endereco: string;
  complemento: string;
  telefone: string;
  pessoaContato: string; // Novo campo
  bairro: string;
  cidade: string;
  codigoPostal: string;
  uf: string;
  pais: string;
  isFavorecido: boolean;
}

export async function saveParceiro(data: ParceiroData) {
  try {
    // 1. Organiza os dados comuns
    const dadosParaSalvar = {
      codigo: data.codigo,
      razaoSocial: data.razaoSocial,
      cnpj: data.cnpj,
      planta: data.planta,
      endereco: data.endereco,
      complemento: data.complemento,
      telefone: data.telefone,
      pessoaContato: data.pessoaContato,
      bairro: data.bairro,
      cidade: data.cidade,
      codigoPostal: data.codigoPostal,
      uf: data.uf,
      pais: data.pais,
    };

    // 2. Salva na tabela correta dependendo do TIPO
    // Usamos 'as any' para evitar bloqueios do TypeScript se o generate não tiver rodado ainda
    switch (data.tipo) {
      case 'terminal':
        await prisma.terminal.create({ data: dadosParaSalvar as any });
        break;
      case 'depot':
        await prisma.depot.create({ data: dadosParaSalvar as any });
        break;
      case 'agente_cargas':
        await prisma.agenteCargas.create({ data: dadosParaSalvar as any });
        break;
      case 'armador':
        await prisma.armador.create({ data: dadosParaSalvar as any });
        break;
      case 'exportador': // Mantendo compatibilidade com o anterior
         await prisma.exportador.create({ data: dadosParaSalvar as any });
         break;
    }

    // 3. Salva no Financeiro se marcado
    if (data.isFavorecido) {
      await prisma.favorecido.create({
        data: {
          codigo: data.codigo,
          razaoSocial: data.razaoSocial,
          cnpj: data.cnpj,
          origem: data.tipo.toUpperCase().replace('_', ' '), // Ex: AGENTE CARGAS
        } as any
      });
    }

    // Atualiza a tela correspondente (mapeamento de rota)
    const rotas = {
      terminal: 'terminal',
      depot: 'depot',
      agente_cargas: 'agente-cargas',
      armador: 'armador',
      exportador: 'exp-imp'
    };
    
    revalidatePath(`/dashboard/cadastro/${rotas[data.tipo]}`);
    
    return { success: true, message: 'Cadastro salvo e sincronizado com sucesso!' };

  } catch (error) {
    console.error('Erro ao salvar:', error);
    // Tratamento simples para erro de código duplicado
    if (String(error).includes('Unique constraint')) {
       return { success: false, message: 'Erro: Este Código já existe no sistema.' };
    }
    return { success: false, message: 'Erro interno ao salvar.' };
  }
}