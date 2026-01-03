import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const veiculos = await prisma.veiculo.findMany();
  return NextResponse.json(veiculos);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const novo = await prisma.veiculo.create({
      data: {
        tipoVeiculo: body.tipoVeiculo,
        placaCavalo: body.placaCavalo,
        modelo: body.modelo,
        cor: body.cor,
        tara: body.tara,
        tamanho: body.tamanho,
        
        // Dados do Proprietário (Obrigatórios no Schema)
        propNome: body.propNome || 'Proprio',
        propCNH: body.propCNH || '000',
        propVencimento: '2030-01-01',
        propCPF: '000.000.000-00',
        propRG: '00.000.000-0',
        propTelefone: '00',

        // Dados do Motorista (Obrigatórios no Schema)
        motNome: body.motNome || 'A Definir',
        motTelefone: body.motTelefone || '00',
        motCPF: body.motCPF || '000',
        motRG: '000',
        motCNH: '000',
        motVencimento: '2030-01-01'
      }
    });
    return NextResponse.json(novo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar' }, { status: 500 });
  }
}