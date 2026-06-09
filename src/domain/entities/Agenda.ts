import { StatusAgenda } from '@/domain/enums';

export class Agenda {
  id_agenda?: number;
  id_doador: number;
  id_hospital: number;
  data_agendada: Date;
  hora_agendada: string;
  status?: StatusAgenda;
  observacao_doador?: string | null;
  observacao_hospital?: string | null;
  data_criacao?: Date;
  data_atualizacao?: Date;

  constructor(props: Omit<Agenda, 'id_agenda'>, id_agenda?: number) {
    Object.assign(this, props);
    if (id_agenda) this.id_agenda = id_agenda;
  }
}
