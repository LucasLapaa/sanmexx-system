import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const fornecedores = await prisma.fornecedor.findMany({ orderBy: { razaoSocial: 'asc' } });
    return NextResponse.json(fornecedores);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const novo = await prisma.fornecedor.create({
      data: {
        razaoSocial: body.razaoSocial,
        cnpj: body.cnpj,
        planta: body.planta || 'Matriz',
        telefone: body.telefone,
        cidade: body.cidade
      }
    });
    return NextResponse.json(novo);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar' }, { status: 500 });
  }
}