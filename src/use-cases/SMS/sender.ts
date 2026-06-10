import axios from 'axios';
import { prisma } from '../../infra/db/connect';
import { env } from '@/shared/env/env';

const OMBALA_BASE_URL = env.OMBALA_BASE_URL;
const OMBALA_TOKEN = env.OMBALA_API_TOKEN;
const OMBALA_FROM = env.OMBALA_FROM;

const ombalaClient = axios.create({
  baseURL: OMBALA_BASE_URL,
  headers: {
    Authorization: `Token ${OMBALA_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// ─── Enviar SMS individual ────────────────────────────────────────────────────

const enviarSMS = async (telefone: string, mensagem: string): Promise<void> => {
    try {
  const numeroNormalizado = telefone
      .replace(/[\+\s\-]/g, '')
      .replace(/^0+/, '');
  await ombalaClient.post('/v1/messages', {
    message: mensagem,
    from: OMBALA_FROM,
    to: numeroNormalizado,
  });
} catch (error: any) {
    console.error('[SMS] Erro detalhado:', JSON.stringify(error.response?.data, null, 2));
    console.error('[SMS] Status:', error.response?.status);
    console.error('[SMS] Payload:', { from: OMBALA_FROM, to: telefone });
    throw error;
}};

// ─── Notificar doadores compatíveis ──────────────────────────────────────────

export async function notificarDoadores(
  tipo_sanguineo: string,
  id_hospital: number
): Promise<void> {

  // 1. Busca o nome do hospital
  const hospital = await prisma.hospital.findUnique({
    where: { id_hospital },
    select: { nome: true },
  });

  // 2. Busca doadores compatíveis com consentimento SMS activo
  const doadores = await prisma.doador.findMany({
    where: {
      tipo_sanguineo: tipo_sanguineo as any,
      consentimento_sms: true,
      status: 'ativo',
    },
    select: { telefone: true },
  });

  if (!doadores.length) {
    console.log(`[SMS] Nenhum doador encontrado para tipo ${tipo_sanguineo}`);
    return;
  }

  const tipoFormatado = tipo_sanguineo
    .replace('_POS', '+')
    .replace('_NEG', '-');

  const nomeHospital = hospital?.nome ?? 'um hospital';

  const mensagem =
    `🚨 URGENTE: ${nomeHospital} precisa de doadores do tipo ${tipoFormatado}. ` +
    `A sua doação pode salvar uma vida. Dirija-se ao hospital o mais rápido possível. Obrigado!`;

  const numeros = doadores
  .map((d) => d.telefone)
  .filter((t): t is string => t !== null && t !== undefined && t.trim() !== '');

  console.log(`[SMS] A enviar para ${numeros.length} doadores do tipo ${tipoFormatado}...`);

  // 3. Envia em lotes de 10 com pausa entre lotes
  const BATCH_SIZE = 10;
  const PAUSA_MS = 500;

  for (let i = 0; i < numeros.length; i += BATCH_SIZE) {
    const lote = numeros.slice(i, i + BATCH_SIZE);

    const resultados = await Promise.allSettled(
      lote.map((telefone) => enviarSMS(telefone, mensagem))
    );

    // Log por resultado
    resultados.forEach((resultado, idx) => {
      if (resultado.status === 'rejected') {
        console.error(`[SMS] Falha ao enviar para ${lote[idx]}:`, resultado.reason?.message);
      } else {
        console.log(`[SMS] Enviado com sucesso para ${lote[idx]}`);
      }
    });

    // Pausa entre lotes para respeitar rate limits da Ombala
    if (i + BATCH_SIZE < numeros.length) {
      await new Promise((resolve) => setTimeout(resolve, PAUSA_MS));
    }
  }

  console.log(`[SMS] Notificações concluídas para ${numeros.length} doadores`);
}