import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// LISTAR TODOS OS CLIENTES
export async function GET() {
  // Mudou de prisma.client para prisma.cliente
  const clientes = await prisma.cliente.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(clientes);
}

// CRIAR NOVO CLIENTE
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Verifica se já existe CNPJ
    const existe = await prisma.cliente.findUnique({
      where: { cnpj: body.cnpj }
    });

    if (existe) {
      return NextResponse.json({ error: 'CNPJ já cadastrado' }, { status: 400 });
    }

    // Cria usando prisma.cliente
    const novoCliente = await prisma.cliente.create({
      data: {
        nome: body.nome,
        cnpj: body.cnpj,
        cidade: body.cidade,
        estado: body.estado,
        status: body.status || 'ATIVO',
        email: body.email,
        telefone: body.telefone,
        endereco: body.endereco
      }
    });
    
    return NextResponse.json(novoCliente);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 500 });
  }
}