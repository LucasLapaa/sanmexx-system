'use server';
import { prisma } from '@/lib/prisma';

export async function getClientes() {
  // Busca apenas o necessário para o dropdown
  return await prisma.cliente.findMany({
    select: {
      id: true,
      razaoSocial: true,
      cnpj: true,
      endereco: true,
      cidade: true,
      uf: true
    },
    orderBy: { razaoSocial: 'asc' }
  });
}