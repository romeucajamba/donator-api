import { StatusAdmin } from '@/domain/enums';

export class Admin {
  id_admin?: number;
  nome_completo: string;
  email: string;
  senha_hash: string;
  status?: StatusAdmin;
  data_criacao?: Date;

  constructor(props: Omit<Admin, 'id_admin'>, id_admin?: number) {
    Object.assign(this, props);
    if (id_admin) this.id_admin = id_admin;
  }
}
