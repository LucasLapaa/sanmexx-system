import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Localiza ou Cria o Cliente automaticamente (pelo nome)
    let client = await prisma.client.findFirst({ where: { name: body.clientName } });
    if (!client) {
      client = await prisma.client.create({
        data: { name: body.clientName, cnpj: '00.000.000/0001-00' } // CNPJ Provisório
      });
    }

    // 2. Localiza ou Cria o Motorista automaticamente (pelo nome)
    let driver = await prisma.driver.findFirst({ where: { name: body.driverName } });
    if (!driver) {
      driver = await prisma.driver.create({
        data: { 
          name: body.driverName, 
          cpf: '000.000.000-00', 
          cnh: '000000000',
          vehiclePlate: 'AAA-0000',
          trailerPlate: 'BBB-0000'
        }
      });
    }

    // 3. Cria a Ordem de Coleta
    const order = await prisma.order.create({
      data: {
        processNumber: body.processNumber,
        sanmexxRef: body.sanmexxRef,
        clientRef: body.clientRef,
        
        origin: body.origin,
        destination: body.destination,
        pickupDate: new Date(body.pickupDate),
        status: "AGENDADO",

        booking: body.booking,
        ship: body.ship,
        terminal: body.terminal,
        containerNum: body.containerNum,
        containerType: body.containerType,
        seal: body.seal,
        tare: body.tare,

        freightValue: parseFloat(body.freightValue) || 0,
        tollValue: parseFloat(body.tollValue) || 0,
        extraValue: parseFloat(body.extraValue) || 0,
        totalValue: parseFloat(body.totalValue) || 0,

        clientId: client.id,
        driverId: driver.id
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar ordem' }, { status: 500 });
  }
}