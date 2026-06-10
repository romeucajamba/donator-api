import { Router } from 'express';
import { AgendaController } from '../controllers/AgendaController';


const routes = Router();
const controller = new AgendaController();

// ======================
// AGENDA
// ======================
routes.post('/',  controller.create);
routes.put('/:id/process', controller.processSchedule);

routes.get('/', controller.listAll); // 🔥 listar todas
routes.get('/:id',  controller.getById); // 🔥 buscar por id

routes.get('/doador/:id_doador',  controller.listMine);
routes.get('/hospital/:id_hospital',  controller.listHospital);

// ======================
// HISTÓRICO
// ======================
routes.post('/historico',  controller.registerHistorico);
routes.get('/historico/doador/:id_doador',  controller.getHistorico);
routes.get('/historico/agenda/:id_agenda',  controller.getHistoricoByAgenda);
routes.delete('/historico/:id',  controller.deleteHistorico);

export { routes as agendaRoutes };