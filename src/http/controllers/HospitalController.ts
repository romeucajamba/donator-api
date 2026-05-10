import { Request, Response } from 'express';
import { CreateHospitalSchema, UpdateHospitalSchema } from '../schemas/hospitalSchema';
import { AuthLoginSchema, newSenhaSchema, updateSenhaSchema } from '../schemas/authSchema';
import { hospitalFactory } from '../factories/hospitalFactory';
import { auditoriaFactory } from '../factories/auditoriaFactory';
import { AppError } from '@/shared/error';
import { ZodError } from 'zod';
import { randomUUID } from 'crypto';

export class HospitalController {

  // ======================
  // CRUD
  // ======================

  async register(req: Request, res: Response) {
    try {
      const data = CreateHospitalSchema.parse(req.body);
      const service = hospitalFactory();

      const result = await service.createHospital(data);
      return res.status(201).json(result);

    } catch (error: any) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao criar hospital', error);
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = hospitalFactory();

      const hospital = await service.getHospitalById(Number(id));
      if (!hospital) throw AppError.notFound('Hospital não encontrado');
      return res.status(200).json(hospital);

    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao buscar hospital', error);
    }
  }

  async getAllHospitais(req: Request, res: Response) {
    try {
      const service = hospitalFactory();

      const hospitais = await service.getAllHospitais();
      if (!hospitais || hospitais.length === 0) throw AppError.notFound('Nenhum hospital encontrado');
      return res.status(200).json(hospitais);

    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao buscar hospitais', error);
    }
  }

  async updateInfo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = UpdateHospitalSchema.parse(req.body);
      const service = hospitalFactory();

      const updated = await service.updateHospital(Number(id), data);
      return res.status(200).json(updated);

    } catch (error: any) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao atualizar hospital', error);
    }
  }

  async deleteHospital(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = hospitalFactory();

      await service.deleteHospital(Number(id));
      return res.status(204).send();

    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao deletar hospital', error);
    }
  }

  // ======================
  // LOGIN
  // ======================

  async login(req: Request, res: Response) {
    try {
      const { email, senha } = AuthLoginSchema.parse(req.body);
      const service = hospitalFactory();

      const result = await service.login(email, senha);

      const auditoria = auditoriaFactory();

      await auditoria.registerAdminSession({
        id_sessao: randomUUID(),
        id_usuario: result.user.id_hospital,
        ip_origem: req.ip || '0.0.0.0',
        user_agent: req.headers['user-agent'] || 'Desconhecido',
        data_expiracao: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });

      await auditoria.createLog({
        id_hospital: result.user.id_hospital,
        acao: 'LOGIN',
        descricao: 'Hospital efetuou login com sucesso',
        ip_origem: req.ip || '0.0.0.0'
      });

      return res.status(200).json({
        message: 'Login com sucesso',
        user: result.user,
        token: result.token
      });

    } catch (error: any) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro no login', error);
    }
  }

  // ======================
  // SEGURANÇA (FALTANTES DO SERVICE)
  // ======================

  async changePassword(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { currentSenha, newSenha } = updateSenhaSchema.parse(req.body);

      const service = hospitalFactory();

      await service.changePassword(Number(id), currentSenha, newSenha);
      return res.status(204).send();

    } catch (error: any) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao alterar senha', error);
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email, newSenha } = newSenhaSchema.parse(req.body);
      const service = hospitalFactory();

      await service.resetPassword(email, newSenha);
      return res.status(204).send();

    } catch (error: any) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao resetar senha', error);
    }
  }
}