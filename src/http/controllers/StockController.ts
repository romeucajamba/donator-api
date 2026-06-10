import { Request, Response } from 'express';
import { CreateStockSchema, RegisterMovimentoSchema, UpdateStockSchema } from '../schemas/stockSchema';
import { stockFactory } from '../factories/stockFactory';
import z, { ZodError } from 'zod';
import { AppError } from '@/shared/error';

export class StockController {

  // === STOCK ===
  async initStock(req: Request, res: Response) {
    try {
      const data = CreateStockSchema.parse(req.body);
      
      const service = stockFactory();

      const result = await service.initializeStock(data);
      return res.status(201).json(result);

    } catch (error) {
      if (error instanceof ZodError) {
      return res.status(400).json({ message: 'Validation failed', issues: error.issues });
    }
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno ao actualizar stock' });
    }
  }

  async getStock(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = stockFactory();

      const stock = await service.getStock(Number(id));
      if (!stock) throw AppError.notFound('Stock record not found');
      return res.status(200).json(stock);

    } catch (error) {
     if (error instanceof ZodError) {
      return res.status(400).json({ message: 'Validation failed', issues: error.issues });
    }
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno ao actualizar stock' });
    }
  }

  async getHospitalStock(req: Request, res: Response) {
    try {
      const { id_hospital } = req.params;

      const hospitalId = Number(id_hospital);

      if (Number.isNaN(hospitalId)) throw AppError.badRequest('Invalid hospital id');

      const service = stockFactory();

      const stocks = await service.getHospitalStock(hospitalId);

      if (!stocks.length) throw AppError.notFound('No stock records found for this hospital');

      return res.status(200).json(stocks);

    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao buscar stock por hospital', error);
    }
  }

  async getAllStocks(req: Request, res: Response) {
    try {
      const service = stockFactory();

      const stocks = await service.getAllStocks();
      if (!stocks.length) throw AppError.notFound('No stock records found');
      return res.status(200).json(stocks);

    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao buscar todos os stocks', error);
    }
  }

  async updateStock(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = UpdateStockSchema.parse(req.body);
      const service = stockFactory();

      const updated = await service.updateStockAbsolute(Number(id), data);
      return res.status(200).json(updated);

    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao atualizar stock', error);
    }
  }

  async updateStockRelative(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantidade_bolsas } = UpdateStockSchema.parse(req.body);
      const service = stockFactory();

      const updated = await service.updateStockRelative(Number(id), quantidade_bolsas);
      return res.status(200).json(updated);

    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
        if (error instanceof AppError) throw error;
        throw AppError.internal('Erro ao atualizar stock', error);
    }
  }

  async deleteStock(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = stockFactory();

      await service.deleteStock(Number(id));
      return res.status(204).send();

    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao excluir stock', error);
    }
  }

  // === MOVIMENTOS ===
  async transact(req: Request, res: Response) {
    try {
      const data = RegisterMovimentoSchema.parse(req.body);
      const service = stockFactory();

      const result = await service.registerMovimento(data);
      return res.status(201).json(result);

    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao registrar movimento', error);
    }
  }

  async getMovimentoById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = stockFactory();

      const movimento = await service.getMovimento(Number(id));
      if (!movimento) throw AppError.notFound('Movement record not found');
      return res.status(200).json(movimento);

    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao buscar movimento', error);
    }
  }

  async getMovimentos(req: Request, res: Response) {
    try {
      const { id_stock } = req.params;
      const service = stockFactory();

      const movimentos = await service.getMovimentosByStock(Number(id_stock));
      if (!movimentos.length) throw AppError.notFound('No movement records found for this stock');
      return res.status(200).json(movimentos);

    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao buscar movimentos', error);
    }
  }

  async getAllMovimentos(req: Request, res: Response) {
    try {
      const service = stockFactory();

      const movimentos = await service.getAllMovimentos();
      if (!movimentos.length) throw AppError.notFound('No movement records found');
      return res.status(200).json(movimentos);

    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao buscar movimentos', error);
    }
  }

  async deleteMovimento(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = stockFactory();

      await service.deleteMovimento(Number(id));
      return res.status(204).send();

    } catch (error) {
      if (error instanceof ZodError) throw AppError.badRequest('Validation failed', error.issues);
            if (error instanceof AppError) throw error;
            throw AppError.internal('Erro ao excluir movimento', error);
    }
  }
}