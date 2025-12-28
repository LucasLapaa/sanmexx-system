import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dados } = body;

    if (!Array.isArray(dados) || dados.length === 0) {
      return NextResponse.json({ error: 'Nenhum dado fornecido' }, { status: 400 });
    }

    const fretesParaSalvar = dados.map((linha: any) => ({
      regiao: linha.regiao || 'GERAL', // Recebe da importação
      origem: linha.origem,
      destino: linha.destino,
      tipoVeiculo: linha.tipoVeiculo,
      valor: parseFloat(linha.valor.toString().replace('R$', '').replace('.', '').replace(',', '.').trim()),
      observacao: 'Importado via Excel'
    }));

    await prisma.tabelaFrete.createMany({
      data: fretesParaSalvar
    });

    return NextResponse.json({ message: 'Importação concluída!', count: fretesParaSalvar.length });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao importar dados' }, { status: 500 });
  }
}