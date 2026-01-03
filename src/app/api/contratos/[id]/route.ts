import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const contrato = await prisma.contract.update({
      where: { id },
      data: {
        numero: body.numeroContrato,
        status: body.status,
        motoristaNome: body.motoristaNome,
        motoristaCpf: body.motoristaCpf,
        placaCavalo: body.placaCavalo,
        origem: body.origem,
        destino: body.destino,
        valorTotal: parseFloat(body.saldoFinal || 0),
        
        // CORREÇÃO: Converte o objeto para Texto (String) antes de salvar
        dadosCompletos: JSON.stringify(body) 
      }
    });

    return NextResponse.json(contrato);
  } catch (error) {
    console.error("Erro ao atualizar contrato:", error);
    return NextResponse.json({ error: 'Erro ao atualizar contrato' }, { status: 500 });
  }
}