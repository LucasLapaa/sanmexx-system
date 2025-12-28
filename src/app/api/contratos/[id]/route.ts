import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// BUSCAR UM CONTRATO (Para Editar)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const contrato = await prisma.contract.findUnique({
    where: { id: params.id }
  });
  return NextResponse.json(contrato);
}

// ATUALIZAR CONTRATO (Salvar Edição)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const contrato = await prisma.contract.update({
    where: { id: params.id },
    data: {
      numero: body.numeroContrato,
      status: body.status,
      motoristaNome: body.motoristaNome,
      motoristaCpf: body.motoristaCpf,
      placaCavalo: body.placaCavalo,
      origem: body.origem,
      destino: body.destino,
      valorTotal: parseFloat(body.saldoFinal || 0),
      dadosCompletos: body // Atualiza o formulário todo
    }
  });
  return NextResponse.json(contrato);
}

// EXCLUIR CONTRATO
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.contract.delete({
    where: { id: params.id }
  });
  return NextResponse.json({ message: 'Deleted' });
}