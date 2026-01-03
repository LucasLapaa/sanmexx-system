'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface ClienteData {
  codigo: string;
  razaoSocial: string;
  cnpj: string;
  planta: string;
  endereco: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  pais: string;
  codigoPostal: string;
  telefone: string;
  pessoaContato: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  isFornecedor: boolean;
}

export async function saveCliente(data: ClienteData) {
  try {
    // --- CORREÇÃO FINAL ---
    // Adicionamos "as any" aqui também para forçar o VS Code a aceitar o campo "codigo"
    const existing = await prisma.cliente.findFirst({
      where: { codigo: data.codigo } as any 
    });

    if (existing) {
      return { success: false, message: 'Erro: Já existe um cliente com este código.' };
    }

    const dadosParaSalvar = {
      codigo: data.codigo,
      razaoSocial: data.razaoSocial,
      cnpj: data.cnpj,
      planta: data.planta,
      endereco: data.endereco,
      complemento: data.complemento,
      bairro: data.bairro,
      cidade: data.cidade,
      uf: data.uf,
      pais: data.pais,
      codigoPostal: data.codigoPostal,
      telefone: data.telefone,
      pessoaContato: data.pessoaContato,
      inscricaoEstadual: data.inscricaoEstadual,
      inscricaoMunicipal: data.inscricaoMunicipal,
    };

    // Salva na tabela de CLIENTES (com silenciador)
    await prisma.cliente.create({
      data: dadosParaSalvar as any, 
    });

    // Se a opção estiver marcada, salva também na tabela de FORNECEDORES
    if (data.isFornecedor) {
      await prisma.fornecedor.create({
        data: dadosParaSalvar as any,
      });
    }

    revalidatePath('/dashboard/cadastro/cliente');
    
    return { success: true, message: 'Cadastro salvo com sucesso!' };

  } catch (error) {
    console.error('Erro ao salvar:', error);
    return { success: false, message: 'Erro interno ao salvar no banco de dados.' };
  }
}