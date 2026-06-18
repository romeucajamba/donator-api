import { Router } from 'express';

import { geografiaRoutes } from './geografia.routes';
import { doadorRoutes } from './doador.routes';
import { hospitalRoutes } from './hospital.routes';
import { stockRoutes } from './stock.routes';
import { pedidoRoutes } from './pedido.routes';
import { agendaRoutes } from './agenda.routes';
import { comunicacaoRoutes } from './comunicacao.routes';
import { gamificacaoRoutes } from './gamificacao.routes';
import { auditoriaRoutes } from './auditoria.routes';
import { adminRoutes } from './admin.routes';

const router = Router();

router.use('/geografia', geografiaRoutes);
router.use('/doador', doadorRoutes);
router.use('/hospital', hospitalRoutes);
router.use('/stock', stockRoutes);
router.use('/pedido', pedidoRoutes);
router.use('/agenda', agendaRoutes);
router.use('/comunicacao', comunicacaoRoutes);
router.use('/gamificacao', gamificacaoRoutes);
router.use('/auditoria', auditoriaRoutes);
router.use('/admin', adminRoutes);

export { router };
