import { Request, Response } from 'express';
import {
  CreateDoadorSchema,
  UpdateDoadorSchema
} from '../schemas/doadorSchema';

import { AuthLoginSchema, emailSchema, newSenhaSchema, updateSenhaSchema } from '../schemas/authSchema';
import { daodorFactory } from '../factories/doadorFactory';
import { auditoriaFactory } from '../factories/auditoriaFactory';
import { AppError } from '@/shared/error';
import { ZodError } from 'zod';
import { env } from '@/shared/env/env';
import { randomUUID } from 'crypto';

export class DoadorController {

  // ======================
  // CRUD DOADOR
  // ======================

  async register(req: Request, res: Response) {
    try {
      const data = CreateDoadorSchema.parse(req.body);
      const service = daodorFactory();

      const result = await service.createDoador(data);
      return res.status(201).json(result);

    } catch (error) {
      
      if (error instanceof ZodError) {
        const formatted = error.issues.map(err => ({
          field: err.path[0],
          message: err.message,
        }));
        throw AppError.badRequest('Validation failed', formatted);
      }

      if (error instanceof AppError) throw error;

      throw AppError.internal('Erro interno, tente novamente mais tarde', error);
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = daodorFactory();

      const doador = await service.getDoadorById(Number(id));

      if (!doador) {
        throw AppError.notFound('Doador não encontrado');
      }
      return res.status(200).json(doador);

    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro interno', error);
    }
  }

  async getAllDoadores(req: Request, res: Response) {
    try {
      const service = daodorFactory();

      const doadores = await service.getAllDoadores();
      if (!doadores || doadores.length === 0) {
        throw AppError.notFound('Nenhum doador encontrado');
      }
      return res.status(200).json(doadores);

    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro interno', error);
    }
  }

  async updateInfo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = UpdateDoadorSchema.parse(req.body);
      
      const service = daodorFactory();

      const updated = await service.updateDoador(Number(id), data);

      return res.status(200).json(updated);

    } catch (error) {
      if (error instanceof ZodError) {
        const formatted = error.issues.map(err => ({
          field: err.path[0],
          message: err.message,
        }));
        throw AppError.badRequest('Validation failed', formatted);
      }

      if (error instanceof AppError) throw error;

      throw AppError.internal('Erro interno', error);
    }
  }

  async deleteDoador(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = daodorFactory();

      await service.deleteDoador(Number(id));
      return res.status(204).send();

    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro interno', error);
    }
  }

  // ======================
  // LOGIN
  // ======================

  async login(req: Request, res: Response) {
    try {
      const { email, senha } = AuthLoginSchema.parse(req.body);
      const service = daodorFactory();

      const result = await service.login(email, senha);

      const auditoria = auditoriaFactory();

      await auditoria.registerDoadorSession({
        id_sessao: randomUUID(),
        id_usuario: result.user.id_doador,
        ip_origem: req.ip || '0.0.0.0',
        user_agent: req.headers['user-agent'] || 'Desconhecido',
        data_expiracao: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });

      await auditoria.createLog({
        id_doador: result.user.id_doador,
        acao: 'LOGIN',
        descricao: 'Doador efetuou login com sucesso',
        ip_origem: req.ip || '0.0.0.0'
      });

      return res.status(200).json({
        message: 'Login com sucesso',
        user: result.user,
        token: result.token
      });
      

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formatted = error.issues.map(err => ({
          field: err.path[0],
          message: err.message,
        }));
        throw AppError.badRequest('Campos inválidos', formatted);
      }

      if (error instanceof AppError) throw error;

      throw AppError.internal('Erro interno no login', error);
    }
  }

  // ======================
  // BUSCAS EXTRAS
  // ======================

  async getByEmail(req: Request, res: Response) {
    try {
      const { email } = emailSchema.parse(req.body);
      const service = daodorFactory();

      const doador = await service.getDoadorByEmail(email);

      if (!doador) {
        throw AppError.notFound('Doador não encontrado');
      }
      return res.status(200).json(doador);

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formatted = error.issues.map(err => ({
          field: err.path[0],
          message: err.message,
        }));
        throw AppError.badRequest('Campos inválidos', formatted);
      }

      if (error instanceof AppError) throw error;

      throw AppError.internal('Erro interno', error);
    }
  }

  async getByTelefone(req: Request, res: Response) {
    try {
      const { telefone } = req.body;
      const service = daodorFactory();

      const doador = await service.getDoadorByTelefone(telefone);

      if (!doador) {
        throw AppError.notFound('Doador não encontrado');
      }
      return res.status(200).json(doador);

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formatted = error.issues.map(err => ({
          field: err.path[0],
          message: err.message,
        }));
        throw AppError.badRequest('Campos inválidos', formatted);
      }

      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro interno', error);
    }
  }

  // ======================
  // SEGURANÇA
  // ======================

  async changePassword(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { currentSenha, newSenha } = updateSenhaSchema.parse(req.body);

      const service = daodorFactory();

      await service.changePassword(Number(id), currentSenha, newSenha);

      return res.status(204).send();

    } catch (error) {
      if (error instanceof ZodError) {
        const formatted = error.issues.map(err => ({
          field: err.path[0],
          message: err.message,
        }));
        throw AppError.badRequest('Campos inválidos', formatted);
      }

      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro interno', error);
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email, newSenha } = newSenhaSchema.parse(req.body);

      const service = daodorFactory();

      await service.resetPassword(email, newSenha);

      return res.status(204).send();

    } catch (error) {
      if (error instanceof ZodError) {
        const formatted = error.issues.map(err => ({
          field: err.path[0],
          message: err.message,
        }));
        throw AppError.badRequest('Campos inválidos', formatted);
      }

      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro interno', error);
    }
  }
}