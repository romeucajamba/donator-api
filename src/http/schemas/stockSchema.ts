import { validations } from "@/lib/zod";
import { TipoSanguineo } from '@/domain/enums';

export const CreateStockSchema = validations.object({
  id_hospital: validations.number().int().positive(),
  tipo_sanguineo: validations.nativeEnum(TipoSanguineo),
  quantidade_bolsas: validations.number().int().min(0).optional()
});

export const RegisterMovimentoSchema = validations.object({
  id_stock: validations.number().int().positive(),
  quantidade: validations.number().int(),
  observacao: validations.string().optional()
});

export const UpdateStockSchema = validations.object({
  quantidade_bolsas: validations.number().int().min(0).optional()
});
