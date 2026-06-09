import { Router } from 'express';
import { HospitalController } from '../controllers/HospitalController';
import { authMiddleware } from '../middleware/authMiddleware';

const routes = Router();
const controller = new HospitalController();

// ======================
// PÚBLICAS
// ======================
routes.post('/register', controller.register);
routes.post('/login', controller.login);

// ======================
// PROTEGIDAS
// ======================

// CRUD
routes.get('/', controller.getAllHospitais);       
routes.get('/:id', controller.getProfile);
routes.put('/:id', controller.updateInfo);
routes.delete('/:id', controller.deleteHospital);    

// SEGURANÇA
routes.put('/:id/change-password', controller.changePassword);
routes.post('/reset-password', controller.resetPassword);

export { routes as hospitalRoutes };