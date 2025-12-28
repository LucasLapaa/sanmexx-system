import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dados } = body; // Recebe um array de linhas

    if (!Array.isArray(dados) || dados.length === 0) {
      return NextResponse.json({ error: 'Nenhum dado fornecido' }, { status: 400 });
    }

    // Prepara os dados para salvar
    const fretesParaSalvar = dados.map((linha: any) => ({
      origem: linha.origem,
      destino: linha.destino,
      tipoVeiculo: linha.tipoVeiculo,
      valor: parseFloat(linha.valor.toString().replace('R$', '').replace('.', '').replace(',', '.').trim()), // Limpa a formatação de dinheiro
      observacao: 'Importado via Excel'
    }));

    // Salva tudo de uma vez (createMany é muito rápido)
    await prisma.tabelaFrete.createMany({
      data: fretesParaSalvar
    });

    return NextResponse.json({ message: 'Importação concluída!', count: fretesParaSalvar.length });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao importar dados' }, { status: 500 });
  }
}