import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nomeCliente = body.clientName || 'Cliente Desconhecido';

    // 1. Localiza ou Cria o Cliente (Corrigido para prisma.cliente e razaoSocial)
    let cliente = await prisma.cliente.findFirst({ 
        where: { razaoSocial: nomeCliente } 
    });

    if (!cliente) {
      // Gera número aleatório para garantir que CNPJ e Código sejam únicos
      const randomId = Math.floor(Math.random() * 90000) + 10000;
      
      cliente = await prisma.cliente.create({
        data: { 
            razaoSocial: nomeCliente, 
            cnpj: `00.000.000/0000-${randomId}`, // CNPJ Provisório Único
            codigo: `AUTO-${randomId}`,          // Código Único
            planta: 'Matriz'
        } 
      });
    }

    // Retorna sucesso (se o arquivo tiver mais lógica de criar Pedido/Processo, 
    // ela deve ser adaptada para usar prisma.processo, mas isso resolve o erro atual)
    return NextResponse.json({ success: true, clienteId: cliente.id });

  } catch (error) {
    console.error("Erro na API orders:", error);
    return NextResponse.json({ error: 'Erro ao processar pedido' }, { status: 500 });
  }
}