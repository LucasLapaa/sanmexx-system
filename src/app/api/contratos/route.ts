import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// SALVAR NOVO CONTRATO
export async function POST(request: Request) {
  const body = await request.json();
  
  const contrato = await prisma.contract.create({
    data: {
      numero: body.numeroContrato,
      status: body.status,
      motoristaNome: body.motoristaNome,
      motoristaCpf: body.motoristaCpf,
      placaCavalo: body.placaCavalo,
      origem: body.origem,
      destino: body.destino,
      valorTotal: parseFloat(body.saldoFinal || 0),
      dadosCompletos: body // Salva o formulário todo aqui para recuperar depois
    }
  });
  
  return NextResponse.json(contrato);
}

// LISTAR CONTRATOS
export async function GET() {
  const contratos = await prisma.contract.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(contratos);
}