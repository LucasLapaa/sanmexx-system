'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- 1. CADASTROS AUXILIARES ---

// Salvar Item de Despesa
export async function saveItemDespesa(nome: string) {
  try {
    await prisma.itemDespesa.create({ data: { nome: nome.toUpperCase() } });
    revalidatePath('/dashboard/financeiro/cadastros');
    return { success: true, message: 'Item cadastrado!' };
  } catch (e) { return { success: false, message: 'Erro: Item já existe.' }; }
}

// Salvar Favorecido (PF e PJ com Código Automático 5 Dígitos)
export async function saveFavorecidoCompleto(data: any) {
  try {
    // 1. Gera Código Automático (5 dígitos sequencial)
    const count = await prisma.favorecido.count();
    const proximoCodigo = (count + 1).toString().padStart(5, '0');

    // 2. Cria o registro
    await prisma.favorecido.create({
      data: {
        tipo: data.tipo, // "PJ" ou "PF"
        codigo: proximoCodigo,
        
        // Dados Principais
        razaoSocial: data.razaoSocial,
        cnpj: data.cnpj, 
        rg: data.rg || null,
        mei: data.mei || null,
        
        // Endereço
        endereco: data.endereco,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf,
        pais: data.pais,
        codigoPostal: data.codigoPostal,
        
        // Contato e Inscrições
        telefone: data.telefone,
        pessoaContato: data.pessoaContato,
        inscricaoEstadual: data.inscricaoEstadual,
        inscricaoMunicipal: data.inscricaoMunicipal,
        
        // Bancário
        banco: data.banco,
        agencia: data.agencia,
        conta: data.conta,
        chavePix: data.chavePix,
        favorecidoBanco: data.favorecidoBanco,
        
        origem: 'MANUAL'
      }
    });

    revalidatePath('/dashboard/financeiro/cadastros');
    return { success: true, message: `Favorecido salvo! Código gerado: ${proximoCodigo}` };
  } catch (e) { 
    console.error(e);
    return { success: false, message: 'Erro ao salvar favorecido.' }; 
  }
}

// --- 2. CONTAS A PAGAR (SOLICITAÇÃO) ---

// Criar Solicitação de Pagamento (Gera Nº Automático ANO + 00001)
export async function createSolicitacao(data: any) {
  try {
    const ano = new Date().getFullYear();
    const count = await prisma.solicitacaoPagamento.count({
      where: { numero: { startsWith: `${ano}` } }
    });
    const sequencia = (count + 1).toString().padStart(5, '0');
    const numeroGerado = `${ano}${sequencia}`;

    const fav = await prisma.favorecido.findUnique({ where: { id: data.favorecidoId } });
    const item = await prisma.itemDespesa.findUnique({ where: { id: data.itemId } });
    
    // Busca Ref do processo se tiver
    let processoRef = null;
    if (data.processoId) {
        const proc = await prisma.processo.findUnique({ where: { id: data.processoId }});
        processoRef = proc?.refSanmexx;
    }

    await prisma.solicitacaoPagamento.create({
      data: {
        numero: numeroGerado,
        favorecidoId: data.favorecidoId,
        favorecidoNome: fav?.razaoSocial || 'Desconhecido',
        itemId: data.itemId,
        itemNome: item?.nome || 'Geral',
        processoId: data.processoId || null,
        processoRef: processoRef,
        valor: Number(data.valor),
        dataPagamento: data.dataPagamento ? new Date(data.dataPagamento) : null,
        tipoPagamento: data.tipoPagamento,
        codigoBarras: data.codigoBarras || null,
        status: 'PENDENTE'
      }
    });

    revalidatePath('/dashboard/financeiro/solicitacao');
    revalidatePath('/dashboard/financeiro/contas-a-pagar');
    return { success: true, message: `Solicitação ${numeroGerado} gerada com sucesso!` };

  } catch (error) {
    console.error(error);
    return { success: false, message: 'Erro ao gerar solicitação.' };
  }
}

// Buscar Contas a Pagar (Para a tabela detalhada)
export async function getContasAPagar(query: string = '') {
  return await prisma.solicitacaoPagamento.findMany({
    where: {
      OR: [
        { numero: { contains: query } },
        { favorecidoNome: { contains: query } },
        { processoRef: { contains: query } }
      ]
    },
    include: {
      favorecido: true, // Traz os dados bancários completos do favorecido
      processo: {
        select: { refCliente: true } // Traz a Ref Cliente do processo
      }
    },
    orderBy: { dataPagamento: 'asc' }
  });
}

// Marcar como Pago
export async function pagarContaAction(id: string) {
  await prisma.solicitacaoPagamento.update({
    where: { id },
    data: { status: 'PAGO' }
  });
  revalidatePath('/dashboard/financeiro/contas-a-pagar');
  return { success: true };
}

// Anexar Arquivos (Salva string do nome)
export async function anexarArquivoAction(id: string, tipo: 'boleto'|'comprovante'|'recibo', nomeArquivo: string) {
  const campo = tipo === 'boleto' ? 'urlBoleto' : tipo === 'comprovante' ? 'urlComprovante' : 'urlRecibo';
  
  await prisma.solicitacaoPagamento.update({
    where: { id },
    data: { [campo]: nomeArquivo }
  });
  revalidatePath('/dashboard/financeiro/contas-a-pagar');
  return { success: true };
}

// --- 3. DADOS AUXILIARES E LISTAS ---

export async function getDadosFinanceiros() {
  const favorecidos = await prisma.favorecido.findMany({ orderBy: { razaoSocial: 'asc' } });
  const itens = await prisma.itemDespesa.findMany({ orderBy: { nome: 'asc' } });
  const processos = await prisma.processo.findMany({ 
    select: { id: true, refSanmexx: true, clienteNome: true },
    orderBy: { createdAt: 'desc' },
    take: 50 
  });
  return { favorecidos, itens, processos };
}

export async function getSolicitacoes(query: string = '') {
  return await prisma.solicitacaoPagamento.findMany({
    where: {
      OR: [
        { numero: { contains: query } },
        { favorecidoNome: { contains: query } },
        { processoRef: { contains: query } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });
}