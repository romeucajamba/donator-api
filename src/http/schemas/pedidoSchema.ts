import { validations } from "@/lib/zod";
import { TipoSanguineo, NivelUrgencia, StatusPedidoEntreHospitais } from '@/domain/enums';
import { StatusPedido } from '@/domain/enums';

// Pedido regular
export const CreatePedidoSchema = validations.object({
  id_hospital: validations.number().int().positive(),
  tipo_sanguineo_necessario: validations.nativeEnum(TipoSanguineo),
  quantidade_necessaria: validations.number().int().positive().optional(),
  id_municipio_pedido: validations.number().int().positive(),
  contacto_referencia: validations.string().min(9),
  nivel_urgencia: validations.nativeEnum(NivelUrgencia),
  mensagem_adicional: validations.string().optional(),
});

// PedidoDoacao
export const CreatePedidoDoacaoSchema = validations.object({
  id_doador: validations.number().int().positive(),
  id_hospital: validations.number().int().positive(),
  mensagem: validations.string().optional()
});

export const AnswerPedidoDoacaoSchema = validations.object({
  status: validations.enum(['aceite', 'rejeitado']),
});

// PedidoEntreHospitais
export const CreatePedidoEntreHospitaisSchema = validations.object({
  id_solicitante: validations.number().int().positive(),
  id_fornecedor: validations.number().int().positive(),
  tipo_sanguineo: validations.nativeEnum(TipoSanguineo),
  quantidade_bolsas: validations.number().int().positive()
});

export const AnswerPedidoEntreSchema = validations.object({
  status: validations.nativeEnum(StatusPedidoEntreHospitais),
  motivo_rejeicao: validations.string().optional()
});

// update pedido normal
export const UpdatePedidoSchema = validations.object({
  status_pedido: validations.nativeEnum(StatusPedido).optional(),
  data_fechamento: validations.date().optional(),
  total_notificados: validations.number().int().optional()
});