import { StatusAdmin } from '@/domain/enums';

export interface CreateAdminDTO {
  nome_completo: string;
  email: string;
  senha?: string; // used for creation, will be hashed in the service
}

export interface UpdateAdminDTO {
  nome_completo?: string;
  email?: string;
  senha?: string;
  status?: StatusAdmin;
}

export interface AdminResponseDTO {
  id_admin: number;
  nome_completo: string;
  email: string;
  status: StatusAdmin;
  data_criacao: Date;
}
