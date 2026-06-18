import { IAdminRepository } from '@/domain/contracts/IAdminRepository';
import { Admin } from '@/domain/entities/Admin';
import { prisma } from '@/infra/db/connect';

export class AdminRepository implements IAdminRepository {
  async create(data: Admin): Promise<Admin> {
    const created = await prisma.admin.create({
      data: {
        nome_completo: data.nome_completo,
        email: data.email,
        senha_hash: data.senha_hash,
        status: data.status,
      }
    });
    return created as unknown as Admin;
  }

  async findById(id_admin: number): Promise<Admin | null> {
    const d = await prisma.admin.findUnique({ where: { id_admin } });
    return d as unknown as Admin | null;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const d = await prisma.admin.findUnique({ where: { email } });
    return d as unknown as Admin | null;
  }

  async findAll(): Promise<Admin[]> {
    const ds = await prisma.admin.findMany();
    return ds as unknown as Admin[];
  }

  async update(id_admin: number, data: Partial<Admin>): Promise<Admin> {
    const updated = await prisma.admin.update({
      where: { id_admin },
      data: data as any
    });
    return updated as unknown as Admin;
  }

  async delete(id_admin: number): Promise<boolean> {
    await prisma.admin.delete({ where: { id_admin } });
    return true;
  }
}
