import { AdminController } from '@/http/controllers/AdminController';
import { AdminService } from '@/use-cases/admin/AdminService';
import { AdminRepository } from '@/infra/repository/AdminRepository';
import { SessaoAdminSistemaRepository } from '@/infra/repository/SessaoAdminSistemaRepository';
import { HospitalService } from '@/use-cases/hospital/HospitalService';
import { HospitalRepository } from '@/infra/repository/HospitalRepository';
import { DoadorService } from '@/use-cases/doador/DoadorService';
import { DoadorRepository } from '@/infra/repository/DoadorRepository';

export const makeAdminController = (): AdminController => {
  const adminRepository = new AdminRepository();
  const sessaoRepository = new SessaoAdminSistemaRepository();
  const adminService = new AdminService(adminRepository, sessaoRepository);

  const hospitalRepository = new HospitalRepository();
  const hospitalService = new HospitalService(hospitalRepository);

  const doadorRepository = new DoadorRepository();
  const doadorService = new DoadorService(doadorRepository);

  return new AdminController(adminService, hospitalService, doadorService);
};
