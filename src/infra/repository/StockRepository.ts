import { IStockRepository } from '@/domain/contracts/IStockRepository';
import { Stock } from '@/domain/entities/Stock';
import { TipoSanguineo } from '@/domain/enums';
import { prisma } from '@/infra/db/connect';


export class StockRepository implements IStockRepository {
  async create(data: Stock): Promise<Stock> {
    const created = await prisma.stock.create({
      data: {
        id_hospital: data.id_hospital,
        tipo_sanguineo: data.tipo_sanguineo as any,
        quantidade_bolsas: data.quantidade_bolsas || 0
      }
    });
    return created as unknown as Stock;
  }

  async findById(id_stock: number): Promise<Stock | null> {
    const s = await prisma.stock.findUnique({ where: { id_stock } });
    return s as unknown as Stock | null;
  }

  async findByHospitalAndTipoSanguineo(id_hospital: number, tipo_sanguineo: TipoSanguineo): Promise<Stock | null> {
    const s = await prisma.stock.findUnique({
      where: {
        id_hospital_tipo_sanguineo: {
          id_hospital,
          tipo_sanguineo: tipo_sanguineo as any
        }
      }
    });
    return s as unknown as Stock | null;
  }

  async findAllByHospital(id_hospital: number): Promise<Stock[]> {
    const s = await prisma.stock.findMany({ 
      where: { id_hospital },
      orderBy: { tipo_sanguineo: 'asc' }
    });
    return s as unknown as Stock[];
  }

  async findAll(): Promise<Stock[]> {
    const s = await prisma.stock.findMany({
      orderBy: { id_stock: 'asc' }
    });
    return s as unknown as Stock[];
  }

  async update(id_stock: number, data: Partial<Stock>): Promise<Stock> {
    const updated = await prisma.stock.update({
      where: { id_stock },
      data: {
        quantidade_bolsas:{
          increment: data.quantidade_bolsas || 0
        },
        }
      });

    return updated as unknown as Stock;
  }

  async decrementStock(id_stock: number, quantidade: number): Promise<Stock> {
    const updated = await prisma.stock.update({
      where: { id_stock },
      data: {
        quantidade_bolsas: {
          decrement: quantidade
        }
      }
    });
    return updated as unknown as Stock;
  }

  async delete(id_stock: number): Promise<boolean> {
    await prisma.stock.delete({ where: { id_stock } });
    return true;
  }
}
