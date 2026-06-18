import { Request, Response } from 'express';
import {
  CreateMensagemSchema,
  DispatchNotificacaoSchema
} from '../schemas/comunicacaoSchema';

import { comunicacaoFactory } from '../factories/comunicacaoFactory';
import { AppError } from '@/shared/error';
import { ZodError } from 'zod';

export class ComunicacaoController {

  // ======================
  // MENSAGENS
  // ======================

  async send(req: Request, res: Response) {
    try {
      const data = CreateMensagemSchema.parse(req.body);
      const service = comunicacaoFactory();

      const result = await service.sendMensagem(data);
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        }));
        throw AppError.badRequest("Validation failed", formattedErrors);
      }

      if (error instanceof AppError) throw error;
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }

  async readMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = comunicacaoFactory();

      const updated = await service.readMensagem(Number(id));
      return res.status(200).json(updated);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }

  async getInbox(req: Request, res: Response) {
    try {
      const { id_hospital } = req.params;
      const service = comunicacaoFactory();

      const mensagens = await service.getReceivedMessages(Number(id_hospital));

      if (mensagens.length === 0) {
        return res.status(200).json({ message:"Nenhuma mensagem encontrada" });
      }
      return res.status(200).json(mensagens);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }

  async getSent(req: Request, res: Response) {
    try {
      const { id_hospital } = req.params;
      const service = comunicacaoFactory();

      const mensagens = await service.getSentMessages(Number(id_hospital));

      if (mensagens.length === 0) {
        return res.status(200).json({ message:"Nenhuma mensagem encontrada" });
      }
      return res.status(200).json(mensagens);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }

  async getAllMessages(req: Request, res: Response) {
    try {
      const service = comunicacaoFactory();

      const mensagens = await service.getAllMessages();

      if (mensagens.length === 0) {
        return res.status(200).json({ message:"Nenhuma mensagem encontrada" });
      }
      return res.status(200).json(mensagens);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }

  // ======================
  // NOTIFICAÇÕES
  // ======================

  async notifyDoador(req: Request, res: Response) {
    try {
      const data = DispatchNotificacaoSchema.parse(req.body);

      console.log("Data recebida no controller:", data);

      const service = comunicacaoFactory();

      const result = await service.dispatchNotificacao(data);
      
      console.log("Resultado da notificação:", result);
      
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        }));
        throw AppError.badRequest("Validation failed", formattedErrors);
      }

      if (error instanceof AppError) throw error;
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }

  async getNotificacoesDoador(req: Request, res: Response) {
    try {
      const { id_doador } = req.params;
      const service = comunicacaoFactory();

      const notificacoes = await service.getNotificacoesDoador(Number(id_doador));

      if (notificacoes.length === 0) {
        return res.status(200).json([]);
      }

      return res.status(200).json(notificacoes);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }

  async getNotificacoesPedido(req: Request, res: Response) {
    try {
      const { id_pedido } = req.params;
      const service = comunicacaoFactory();

      const result = await service.getNotificacoesPedido(Number(id_pedido));

      if (result.length === 0) {
        return res.status(200).json([]);
      }

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }

  async getAllNotificacoes(req: Request, res: Response) {
    try {
      const service = comunicacaoFactory();

      const result = await service.getAllNotificacoes();

      if (result.length === 0) {
        return res.status(200).json([]);
      }
      
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }


  async deleteNotificacao(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = comunicacaoFactory();

      await service.deleteNotificacao(Number(id));
      return res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }

  // ======================
  // MENSAGEM DELETE (extra do service)
  // ======================

  async deleteMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = comunicacaoFactory();

      await service.deleteMensagem(Number(id));
      return res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internal("Erro interno, tente novamente mais tarde", error);
    }
  }
}