import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const fretes = await prisma.tabelaFrete.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(fretes);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar fretes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Tratamento simples para garantir que o valor seja um número
    let valorFormatado = 0;
    if (typeof body.valor === 'string') {
        // Remove R$, pontos de milhar e troca vírgula por ponto
        valorFormatado = parseFloat(body.valor.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
    } else {
        valorFormatado = Number(body.valor);
    }

    const frete = await prisma.tabelaFrete.create({
      data: {
        regiao: body.regiao || 'GERAL',
        origem: body.origem,
        destino: body.destino,
        tipoVeiculo: body.tipoVeiculo,
        valor: valorFormatado,
        
        // CORREÇÃO AQUI: O banco espera 'observacoes' (plural)
        observacoes: body.observacao || '' 
      }
    });

    return NextResponse.json(frete);
  } catch (error) {
    console.error('Erro ao salvar frete:', error);
    return NextResponse.json({ error: 'Erro ao criar frete' }, { status: 500 });
  }
}