import { ISessaoAdminSistemaRepository, SessaoAdminSistemaParams } from '@/domain/contracts/ISessaoAdminSistemaRepository';
import { prisma } from '@/infra/db/connect';

export class SessaoAdminSistemaRepository implements ISessaoAdminSistemaRepository {
  async create(data: SessaoAdminSistemaParams): Promise<void> {
    await prisma.sessaoAdminSistema.create({
      data: {
        id_sessao: data.id_sessao,
        id_admin: data.id_admin,
        ip_origem: data.ip_origem,
        user_agent: data.user_agent,
        data_expiracao: data.data_expiracao,
        ativo: true
      }
    });
  }

  async findById(id_sessao: string): Promise<any | null> {
    return await prisma.sessaoAdminSistema.findUnique({
      where: { id_sessao }
    });
  }

  async invalidate(id_sessao: string): Promise<void> {
    await prisma.sessaoAdminSistema.update({
      where: { id_sessao },
      data: { ativo: false }
    });
  }

  async invalidateAllFromAdmin(id_admin: number): Promise<void> {
    await prisma.sessaoAdminSistema.updateMany({
      where: { id_admin, ativo: true },
      data: { ativo: false }
    });
  }
}
