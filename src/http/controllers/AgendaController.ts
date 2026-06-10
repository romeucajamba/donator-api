import { Request, Response } from 'express';
import {
  CreateAgendaSchema,
  UpdateAgendaSchema,
  CreateHistoricoDoacaoSchema
} from '../schemas/agendaSchema';

import { agendaFactory } from '../factories/agendaFactory';
import { gamificacaoFactory } from '../factories/gamificacaoFactory';
import { AppError } from '@/shared/error';
import { ZodError } from 'zod';

export class AgendaController {

  // === AGENDA ===
  async create(req: Request, res: Response) {
    try {
      const data = CreateAgendaSchema.parse(req.body);
      const service = agendaFactory();
      
      const dataHora = `${data.data_agendada}T${data.hora_agendada}:00`;

      const result = await service.schedule({
        id_doador: data.id_doador,
        id_hospital: data.id_hospital,
        data_agendada: data.data_agendada,
        hora_agendada: dataHora,
        observacao_doador: data.observacao_doador
      });

      return res.status(201).json(result);
    } catch (error) {
            if (error instanceof ZodError) {
              const formattedErrors = error.issues.map((err) => ({
                field: err.path[0],
                message: err.message,
              }));
              throw AppError.badRequest("Validation failed", formattedErrors);
            }
      
            if (error instanceof AppError) {
              throw error;
            }
      
            //console.error(error);
            throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }

  async processSchedule(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = UpdateAgendaSchema.parse(req.body);
      console.log("Processando agenda ID:", id, "com dados:", data);
      const service = agendaFactory();

      const updated = await service.updateScheduleState(Number(id), data);

      if (data.status === 'concluida') {
        const gamificacao = gamificacaoFactory();
        await gamificacao.incrementDonationStats(updated.id_doador);
      }

      return res.status(200).json(updated);
    } catch (error) {
            if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        }));
        throw AppError.badRequest("Validation failed", formattedErrors);
      }

      if (error instanceof AppError) {
        throw error;
      }

      //console.error(error);
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }

  async listMine(req: Request, res: Response) {
    try {
      const { id_doador } = req.params;
      const service = agendaFactory();

      const agendas = await service.getDoadoresAgenda(Number(id_doador));

      if (!agendas || agendas.length === 0) {
        return res.status(404).json({ error: 'Nenhuma agenda encontrada para este doador' });
      }
      return res.status(200).json(agendas);
    } catch (error) {
            if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        }));
        throw AppError.badRequest("Validation failed", formattedErrors);
      }

      if (error instanceof AppError) {
        throw error;
      }

      //console.error(error);
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }

  async listHospital(req: Request, res: Response) {
    try {
      const { id_hospital } = req.params;
      const service = agendaFactory();

      const agendas = await service.getHospitalAgenda(Number(id_hospital));
      if (!agendas || agendas.length === 0) {
        return res.status(404).json({ error: 'Nenhuma agenda encontrada para este hospital' });
      }
      return res.status(200).json(agendas);
    } catch (error) {
            if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        }));
        throw AppError.badRequest("Validation failed", formattedErrors);
      }

      if (error instanceof AppError) {
        throw error;
      }

      //console.error(error);
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }

  async listAll(req: Request, res: Response) {
    try {
      const service = agendaFactory();
      const agendas = await service.getAllAgendas();

      if (!agendas || agendas.length === 0) {
        return res.status(404).json({ error: 'Nenhuma agenda encontrada' });
      }
      return res.status(200).json(agendas);
    } catch (error) {
            if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        }));
        throw AppError.badRequest("Validation failed", formattedErrors);
      }

      if (error instanceof AppError) {
        throw error;
      }

      //console.error(error);
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = agendaFactory();

      const agenda = await service.getScheduleById(Number(id));
      if (!agenda) {
        return res.status(404).json({ error: 'Agenda não encontrada' });
      }
      return res.status(200).json(agenda);
    } catch (error) {
            if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        }));
        throw AppError.badRequest("Validation failed", formattedErrors);
      }

      if (error instanceof AppError) {
        throw error;
      }

      //console.error(error);
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }

  // === HISTÓRICO ===
  async registerHistorico(req: Request, res: Response) {
    try {
      const data = CreateHistoricoDoacaoSchema.parse(req.body);
      const service = agendaFactory();

      const result = await service.registerHistoricoManually({
        id_agenda: data.id_agenda,
        id_doador: data.id_doador,
        id_hospital: data.id_hospital,
        data_doacao: data.data_doacao,
        observacao: data.observacao
      });

      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        }));
        throw AppError.badRequest("Validation failed", formattedErrors);
      }

      if (error instanceof AppError) {
        throw error;
      }

      //console.error(error);
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }

  async getHistorico(req: Request, res: Response) {
    try {
      const { id_doador } = req.params;
      const service = agendaFactory();

      const historico = await service.getHistorico(Number(id_doador));
      if (!historico || historico.length === 0) {
        return res.status(404).json({ error: 'Nenhum histórico encontrado para este doador' });
      }
      return res.status(200).json(historico);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        }));
        throw AppError.badRequest("Validation failed", formattedErrors);
      }

      if (error instanceof AppError) {
        throw error;
      }

      //console.error(error);
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }

  async getHistoricoByAgenda(req: Request, res: Response) {
    try {
      const { id_agenda } = req.params;
      const service = agendaFactory();

      const historico = await service.getHistoricoById(Number(id_agenda));
      if (!historico) {
        return res.status(404).json({ error: 'Nenhum histórico encontrado para esta agenda' });
      }
      return res.status(200).json(historico);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        }));
        throw AppError.badRequest("Validation failed", formattedErrors);
      }

      if (error instanceof AppError) {
        throw error;
      }

      //console.error(error);
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }

  async deleteHistorico(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = agendaFactory();

      await service.deleteHistorico(Number(id));

      return res.status(204).send();

    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        }));
        throw AppError.badRequest("Validation failed", formattedErrors);
      }

      if (error instanceof AppError) {
        throw error;
      }

      //console.error(error);
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }
}