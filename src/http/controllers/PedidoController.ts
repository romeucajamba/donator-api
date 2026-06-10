import { Request, Response } from 'express';
import {
  CreatePedidoSchema, CreatePedidoDoacaoSchema, AnswerPedidoDoacaoSchema,
  CreatePedidoEntreHospitaisSchema, AnswerPedidoEntreSchema, UpdatePedidoSchema
} from '../schemas/pedidoSchema';
import { pedidoFactory } from '../factories/pedidoFactory';
import { auditoriaFactory } from '../factories/auditoriaFactory';
import { ZodError } from 'zod';
import { AppError } from '@/shared/error';

export class PedidoController {

  // === PEDIDO URGÊNCIA/SMS ===
  async openPedido(req: Request, res: Response) {
    try {
      const data = CreatePedidoSchema.parse(req.body);
      const service = pedidoFactory();
      const result = await service.createPedido(data);

      const auditoria = auditoriaFactory();
      await auditoria.createLog({
        id_hospital: data.id_hospital,
        acao: 'NOVO_PEDIDO_URGENTE',
        descricao: `Novo pedido urgente criado para tipo ${data.tipo_sanguineo_necessario}`,
        ip_origem: req.ip || '0.0.0.0'
      });

      return res.status(201).json(result);
    } catch (error: any) {
            if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao buscar pedidos de doação por doador', error);
    }
  }

  async updatePedido(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = UpdatePedidoSchema.parse(req.body);

      const service = pedidoFactory();
      const updated = await service.updatePedido(Number(id), data);

      return res.status(200).json(updated);
    } catch (error) {
            if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao buscar pedidos de doação por doador', error);
    }
  }

  async getHospitalPedidos(req: Request, res: Response) {
    try {
      const { id_hospital } = req.params;
      const service = pedidoFactory();

      const pedidos = await service.getHospitalPedidos(Number(id_hospital));
      if (!pedidos || pedidos.length === 0) {
        return res.status(404).json({ error: 'Nenhum pedido encontrado para este hospital' });
      }
      return res.status(200).json(pedidos);
    } catch (error: any) {
            if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao buscar pedidos de doação por doador', error);
    }
  }

  async getAllPedidos(req: Request, res: Response) {
    try {
      const service = pedidoFactory();
      const pedidos = await service.getAllPedidos();
      if (!pedidos || pedidos.length === 0) {
        return res.status(404).json({ error: 'Nenhum pedido encontrado' });
      }
      return res.status(200).json(pedidos);
    } catch (error: any) {
            if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao buscar pedidos de doação por doador', error);
    }
  }

  async getPedidoById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = pedidoFactory();

      const pedido = await service.getPedidoById(Number(id));
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }
      return res.status(200).json(pedido);
    } catch (error: any) {
            if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao buscar pedidos de doação por doador', error);
    }
  }

  async deletePedido(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = pedidoFactory();

      await service.deletePedido(Number(id));
      return res.status(204).send();
    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao buscar pedidos de doação por doador', error);
    }
  }

  // === PEDIDO DOAÇÃO ===
  async requestDoacao(req: Request, res: Response) {
    try {
      const data = CreatePedidoDoacaoSchema.parse(req.body);
      const service = pedidoFactory();

      const result = await service.requestDoacao(data);
      return res.status(201).json(result);
    } catch (error) {
            if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao buscar pedidos de doação por doador', error);
    }
  }

  async answerDoacao(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = AnswerPedidoDoacaoSchema.parse(req.body);

      const service = pedidoFactory();
      const updated = await service.answerPedidoDoacao(Number(id), {
        status,
        data_resposta: new Date()
      });

      return res.status(200).json(updated);
    } catch (error) {
            if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao responder pedido de doação', error);
    }
  }

  async getDoacoesByDoador(req: Request, res: Response) {
    try {
      const { id_doador } = req.params;
      const service = pedidoFactory();

      const pedidos = await service.getAllDoacoesByDoador(Number(id_doador));
      if (!pedidos || pedidos.length === 0) {
        return res.status(404).json({ error: 'Nenhum pedido de doação encontrado para este doador' });
      }
      return res.status(200).json(pedidos);
    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao buscar pedidos de doação por doador', error);
    }
  }

  async getDoacoesByHospital(req: Request, res: Response) {
    try {
      const { id_hospital } = req.params;
      const service = pedidoFactory();

      const pedidos = await service.getDoacoesByHospital(Number(id_hospital));
      if (!pedidos || pedidos.length === 0) {
        return res.status(404).json({ error: 'Nenhum pedido de doação encontrado para este hospital' });
      }
      return res.status(200).json(pedidos);
    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao buscar pedidos de doação por hospital', error);
    }
  }

  async getAllDoacoes(req: Request, res: Response) {
    try {
      const service = pedidoFactory();
      const pedidos = await service.getAllDoacoes();
      if (!pedidos || pedidos.length === 0) {
        return res.status(404).json({ error: 'Nenhum pedido de doação encontrado' });
      }
      return res.status(200).json(pedidos);
    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao buscar todos os pedidos de doação', error);
    }
  }

  async deletePedidoDoacao(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = pedidoFactory();

      await service.deletePedidoDoacao(Number(id));

      return res.status(204).send();
    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao excluir pedido de doação', error);
    }
  }

  // === ENTRE HOSPITAIS ===
  async requestBolsas(req: Request, res: Response) {
    try {
      const data = CreatePedidoEntreHospitaisSchema.parse(req.body);

      const service = pedidoFactory();

      const result = await service.requestBolsas(data);
  
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao solicitar bolsas', error);
    }
  }

  async answerBolsas(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = AnswerPedidoEntreSchema.parse(req.body);

      const service = pedidoFactory();
      const updated = await service.answerPedidoBolsas(Number(id), {
        ...data,
        data_resposta: new Date()
      });

      return res.status(200).json(updated);
    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao responder pedido entre hospitais', error);
    }
  }

  async getPedidoEntreById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = pedidoFactory();

      const pedido = await service.getPedidoEntreHospitaisById(Number(id));
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido entre hospitais não encontrado' });
      }
      return res.status(200).json(pedido);
    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao buscar pedido entre hospitais', error);
    }
  }

  async getBySolicitante(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = pedidoFactory();

      const pedidos = await service.getAllBySolicitante(Number(id));
      if (!pedidos || pedidos.length === 0) {
        return res.status(404).json({ error: 'Nenhum pedido entre hospitais encontrado para este solicitante' });
      }
      return res.status(200).json(pedidos);
    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao buscar pedidos por solicitante', error);
    }
  }

  async getByFornecedor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = pedidoFactory();

      const pedidos = await service.getAllByFornecedor(Number(id));
      if (!pedidos || pedidos.length === 0) {
        return res.status(404).json({ error: 'Nenhum pedido entre hospitais encontrado para este fornecedor' });
      }
      return res.status(200).json(pedidos);
    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao buscar pedidos por fornecedor', error);
    }
  }

  async getAllEntreHospitais(req: Request, res: Response) {
    try {
      const service = pedidoFactory();
      const pedidos = await service.getAll();
      
      if (!pedidos || pedidos.length === 0) {
        return res.status(404).json({ error: 'Nenhum pedido entre hospitais encontrado' });
      }
      return res.status(200).json(pedidos);
    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao buscar pedidos entre hospitais', error);
    }
  }

  async deletePedidoEntre(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = pedidoFactory();

      await service.deletePedidoEntreHospitais(Number(id));
      return res.status(204).send();
    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
      if (error instanceof AppError) throw error;
      throw AppError.internal('Erro ao deletar pedido entre hospitais', error);
    }
  }
}
