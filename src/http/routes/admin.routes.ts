import { Router } from 'express';
import { makeAdminController } from '@/http/factories/AdminFactory';
import { ensureAdminAuthenticated } from '@/http/middleware/ensureAdminAuthenticated';

const adminRoutes = Router();
const adminController = makeAdminController();

// Public routes
adminRoutes.post('/auth/login', adminController.login.bind(adminController));
adminRoutes.post('/register', adminController.create.bind(adminController));

// Protected routes
adminRoutes.use(ensureAdminAuthenticated);

adminRoutes.get('/', adminController.getAll.bind(adminController));

// Hospitais
adminRoutes.patch('/hospitals/:id/status', adminController.changeHospitalStatus.bind(adminController));

// Doadores
adminRoutes.get('/donors', adminController.getAllDonors.bind(adminController));
adminRoutes.patch('/donors/:id/status', adminController.changeDonorStatus.bind(adminController));

// Routes with :id MUST come last!
adminRoutes.get('/:id', adminController.getById.bind(adminController));
adminRoutes.put('/:id', adminController.update.bind(adminController));
adminRoutes.delete('/:id', adminController.delete.bind(adminController));

export { adminRoutes };
