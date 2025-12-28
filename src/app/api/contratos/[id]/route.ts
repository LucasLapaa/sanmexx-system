import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// BUSCAR UM CONTRATO (Para Editar)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // <--- AQUI ESTÁ A CORREÇÃO (AWAIT)

  const contrato = await prisma.contract.findUnique({
    where: { id: id }
  });
  return NextResponse.json(contrato);
}

// ATUALIZAR CONTRATO (Salvar Edição)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // <--- CORREÇÃO AQUI TAMBÉM
  const body = await request.json();

  const contrato = await prisma.contract.update({
    where: { id: id },
    data: {
      numero: body.numeroContrato,
      status: body.status,
      motoristaNome: body.motoristaNome,
      motoristaCpf: body.motoristaCpf,
      placaCavalo: body.placaCavalo,
      origem: body.origem,
      destino: body.destino,
      valorTotal: parseFloat(body.saldoFinal || 0),
      dadosCompletos: body
    }
  });
  return NextResponse.json(contrato);
}

// EXCLUIR CONTRATO
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // <--- CORREÇÃO AQUI TAMBÉM

  await prisma.contract.delete({
    where: { id: id }
  });
  return NextResponse.json({ message: 'Deleted' });
}