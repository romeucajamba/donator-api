import { IAgendaRepository } from '@/domain/contracts/IAgendaRepository';
import { Agenda } from '@/domain/entities/Agenda';
import { prisma } from '@/infra/db/connect';

export class AgendaRepository implements IAgendaRepository {
  async create(data: Agenda): Promise<Agenda> {
    const created = await prisma.agenda.create({
      data: {
        id_doador: data.id_doador,
        id_hospital: data.id_hospital,
        data_agendada: data.data_agendada,
        hora_agendada: data.hora_agendada,
        observacao_doador: data.observacao_doador
      }
    });
    return created as unknown as Agenda;
  }

  async findById(id_agenda: number): Promise<Agenda | null> {
    const a = await prisma.agenda.findUnique({ 
      where: { id_agenda },
      include: {
        doador: true,
        hospital: true
      }
    });
    return a as unknown as Agenda | null;
  }

  async findAllByDoador(id_doador: number): Promise<Agenda[]> {
    const a = await prisma.agenda.findMany({ 
      where: { id_doador },
      include: {
        doador: true,
        hospital: true
      }
    });
    return a as unknown as Agenda[];
  }

  async findAllByHospital(id_hospital: number): Promise<Agenda[]> {
    const a = await prisma.agenda.findMany({ 
      where: { id_hospital },
      include: {
        doador: true,
        hospital: true
      }
    });
    return a as unknown as Agenda[];
  }

  async findAll(): Promise<Agenda[]> {
    const a = await prisma.agenda.findMany(
      {
        include: {
          doador: true,
          hospital: true
        }
      }
    );
    return a as unknown as Agenda[];
  }

  async update(id_agenda: number, data: Partial<Agenda>): Promise<Agenda> {
    const updated = await prisma.agenda.update({
      where: { id_agenda },
      data: data as any
    });
    return updated as unknown as Agenda;
  }

  async delete(id_agenda: number): Promise<boolean> {
    await prisma.agenda.delete({ where: { id_agenda } });
    return true;
  }
}
