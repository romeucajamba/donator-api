import { IMovimentoStockRepository } from '@/domain/contracts/IMovimentoStockRepository';
import { MovimentoStock } from '@/domain/entities/MovimentoStock';
import { prisma } from '@/infra/db/connect';

export class MovimentoStockRepository implements IMovimentoStockRepository {
  async create(data: MovimentoStock): Promise<MovimentoStock> {
    const created = await prisma.movimentoStock.create({
      data: {
        id_stock: data.id_stock,
        quantidade: data.quantidade,
        observacao: data.observacao
      }
    });
    return created as MovimentoStock;
  }

  async findById(id_movimento: number): Promise<MovimentoStock | null> {
    const m = await prisma.movimentoStock.findUnique({ where: { id_movimento } });
    return m as MovimentoStock | null;
  }

  async findAllByStock(id_stock: number): Promise<MovimentoStock[]> {
    const m = await prisma.movimentoStock.findMany({ where: { id_stock } });
    return m as MovimentoStock[];
  }

  async findAll(): Promise<MovimentoStock[]> {
    const m = await prisma.movimentoStock.findMany();
    return m as MovimentoStock[];
  }

  async update(id_movimento: number, data: Partial<MovimentoStock>): Promise<MovimentoStock> {
    const updated = await prisma.movimentoStock.update({
      where: { id_movimento },
      data
    });
    return updated as MovimentoStock;
  }

  async delete(id_movimento: number): Promise<boolean> {
    await prisma.movimentoStock.delete({ where: { id_movimento } });
    return true;
  }
  
}
