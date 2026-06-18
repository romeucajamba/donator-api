import { Router } from 'express';
import { GeografiaController } from '../controllers/GeografiaController';
import { ensureAdminAuthenticated } from '../middleware/ensureAdminAuthenticated';

const routes = Router();
const controller = new GeografiaController();

// ======================
// PROVÍNCIAS
// ======================

// Criar (Apenas Admin)
routes.post('/provincias', ensureAdminAuthenticated, controller.createProvincia);

// Listar todas (Público - usado no registo de utilizadores)
routes.get('/provincias', controller.getAllProvincias);

// Buscar por ID (Público)
routes.get('/provincias/:id', controller.getProvinciaById);

// Atualizar (Apenas Admin)
routes.put('/provincias/:id', ensureAdminAuthenticated, controller.updateProvincia);

// Deletar (Apenas Admin)
routes.delete('/provincias/:id', ensureAdminAuthenticated, controller.deleteProvincia);


// ======================
// MUNICÍPIOS
// ======================

// Criar (Apenas Admin)
routes.post('/municipios', ensureAdminAuthenticated, controller.createMunicipio);

// Listar todos (Público)
routes.get('/municipios', controller.getAllMunicipios);

// Buscar por ID (Público)
routes.get('/municipios/:id', controller.getMunicipioById);

// Atualizar (Apenas Admin)
routes.put('/municipios/:id', ensureAdminAuthenticated, controller.updateMunicipio);

// Deletar (Apenas Admin)
routes.delete('/municipios/:id', ensureAdminAuthenticated, controller.deleteMunicipio);


export { routes as geografiaRoutes };