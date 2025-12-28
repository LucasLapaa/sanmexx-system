import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const fretes = await prisma.tabelaFrete.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(fretes);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const valorFormatado = body.valor ? parseFloat(body.valor) : 0;

    const frete = await prisma.tabelaFrete.create({
      data: {
        regiao: body.regiao || 'GERAL', // Salva GERAL se não informar
        origem: body.origem,
        destino: body.destino,
        tipoVeiculo: body.tipoVeiculo,
        valor: valorFormatado,
        observacao: body.observacao || ''
      }
    });
    return NextResponse.json(frete);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
  }
}