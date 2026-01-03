import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// LISTAR CLIENTES
export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { razaoSocial: 'asc' }
    });
    return NextResponse.json(clientes);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar clientes' }, { status: 500 });
  }
}

// CRIAR NOVO CLIENTE
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validação básica
    if (!body.nome || !body.cnpj) {
      return NextResponse.json({ error: 'Nome e CNPJ são obrigatórios' }, { status: 400 });
    }

    // Verifica se já existe CNPJ
    const existe = await prisma.cliente.findUnique({
      where: { cnpj: body.cnpj }
    });

    if (existe) {
      return NextResponse.json({ error: 'CNPJ já cadastrado' }, { status: 400 });
    }

    // Gera código automático se não vier
    let codigoFinal = body.codigo;
    if (!codigoFinal) {
        const count = await prisma.cliente.count();
        codigoFinal = `CLI-${(count + 1).toString().padStart(4, '0')}`;
    }

    // CRIAÇÃO NO BANCO
    const novoCliente = await prisma.cliente.create({
      data: {
        razaoSocial: body.nome, 
        cnpj: body.cnpj,
        codigo: codigoFinal,
        
        planta: body.planta || 'Matriz',
        endereco: body.endereco || null,
        bairro: body.bairro || null,
        cidade: body.cidade || null,
        uf: body.estado || body.uf || null,
        pais: body.pais || 'Brasil',
        codigoPostal: body.cep || body.codigoPostal || null,
        telefone: body.telefone || null,
        
        // --- LINHA DO EMAIL REMOVIDA AQUI PARA CORRIGIR O ERRO ---
        
        diasPagamento: Number(body.diasPagamento) || 15
      }
    });

    return NextResponse.json(novoCliente);

  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return NextResponse.json({ error: 'Erro interno ao criar cliente' }, { status: 500 });
  }
}