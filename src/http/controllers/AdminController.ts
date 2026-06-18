import { Request, Response } from 'express';
import { AdminService } from '@/use-cases/admin/AdminService';
import { HospitalService } from '@/use-cases/hospital/HospitalService';
import { DoadorService } from '@/use-cases/doador/DoadorService';

export class AdminController {
  constructor(
    private adminService: AdminService,
    private hospitalService: HospitalService,
    private doadorService: DoadorService
  ) {}

  // ... existing methods ...
  async create(req: Request, res: Response): Promise<Response> {
    const admin = await this.adminService.createAdmin(req.body);
    return res.status(201).json(admin);
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, senha } = req.body;
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'];

    const result = await this.adminService.login(email, senha, ip, userAgent);
    return res.json(result);
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const admins = await this.adminService.getAllAdmins();
    return res.json(admins);
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const admin = await this.adminService.getAdminById(Number(id));
    return res.json(admin);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const admin = await this.adminService.updateAdmin(Number(id), req.body);
    return res.json(admin);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await this.adminService.deleteAdmin(Number(id));
    return res.status(204).send();
  }

  async changeHospitalStatus(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { status } = req.body;
    
    const updated = await this.hospitalService.updateHospital(Number(id), { status });
    return res.json(updated);
  }

  // --- Doadores ---
  async getAllDonors(req: Request, res: Response): Promise<Response> {
    const donors = await this.doadorService.getAllDoadores();
    return res.json(donors);
  }

  async changeDonorStatus(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { status } = req.body; // ativo, inativo, bloqueado
    const updated = await this.doadorService.updateDoador(Number(id), { status });
    return res.json(updated);
  }
}
