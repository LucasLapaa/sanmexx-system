import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && user.password === password) {
    // Login Sucesso
    return NextResponse.json({ success: true, user });
  } else {
    // Login Falha
    return NextResponse.json({ success: false }, { status: 401 });
  }
}