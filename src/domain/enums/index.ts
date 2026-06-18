export enum TipoSanguineo {
  A_POS = 'A_POS',
  A_NEG = 'A_NEG',
  B_POS = 'B_POS',
  B_NEG = 'B_NEG',
  O_POS = 'O_POS',
  O_NEG = 'O_NEG',
  AB_POS = 'AB_POS',
  AB_NEG = 'AB_NEG'
}

export enum StatusDoador {
  ativo = 'ativo',
  inativo = 'inativo',
  bloqueado = 'bloqueado'
}

export enum StatusHospital {
  ativo = 'ativo',
  suspenso = 'suspenso',
  inativo = 'inativo'
}

export enum NivelUrgencia {
  urgente = 'urgente',
  emergencia = 'emergencia'
}

export enum StatusPedido {
  ativo = 'ativo',
  fechado = 'fechado',
  cancelado = 'cancelado'
}

export enum StatusNotificacao {
  sucesso = 'sucesso',
  falha = 'falha'
}

export enum StatusAgenda {
  pendente = 'pendente',
  confirmada = 'confirmada',
  rejeitada = 'rejeitada',
  concluida = 'concluida',
  cancelada = 'cancelada'
}

export enum StatusPedidoDoacao {
  pendente = 'pendente',
  aceite = 'aceite',
  rejeitado = 'rejeitado',
  cancelado = 'cancelado'
}

export enum StatusMensagem {
  enviada = 'enviada',
  lida = 'lida'
}

export enum StatusPedidoEntreHospitais {
  pendente = 'pendente',
  aceite = 'aceite',
  rejeitado = 'rejeitado',
  cancelado = 'cancelado'
}

export enum StatusAdmin {
  ativo = 'ativo',
  inativo = 'inativo'
}
