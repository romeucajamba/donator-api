export interface SessaoAdminSistemaParams {
  id_sessao: string;
  id_admin: number;
  ip_origem: string;
  user_agent?: string;
  data_expiracao: Date;
}

export interface ISessaoAdminSistemaRepository {
  create(data: SessaoAdminSistemaParams): Promise<void>;
  findById(id_sessao: string): Promise<any | null>;
  invalidate(id_sessao: string): Promise<void>;
  invalidateAllFromAdmin(id_admin: number): Promise<void>;
}
