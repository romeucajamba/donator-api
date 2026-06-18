import { IAdminRepository } from '@/domain/contracts/IAdminRepository';
import { ISessaoAdminSistemaRepository } from '@/domain/contracts/ISessaoAdminSistemaRepository';
import { CreateAdminDTO, UpdateAdminDTO, AdminResponseDTO } from '@/interfaces/dtos/AdminDTO';
import { Admin } from '@/domain/entities/Admin';
import { AppError } from '@/shared/error';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '@/shared/env/env';
import crypto from 'crypto';

export class AdminService {
  constructor(
    private adminRepository: IAdminRepository,
    private sessaoRepository: ISessaoAdminSistemaRepository
  ) {}

  async createAdmin(data: CreateAdminDTO): Promise<AdminResponseDTO> {
    const existingEmail = await this.adminRepository.findByEmail(data.email);
    if (existingEmail) throw AppError.conflict('Email already in use');

    if (!data.senha) {
      throw AppError.badRequest('Password is required');
    }
    
    const senha_hash = await bcrypt.hash(data.senha, 10);

    const adminEntity = new Admin({
      nome_completo: data.nome_completo,
      email: data.email,
      senha_hash
    });

    const created = await this.adminRepository.create(adminEntity);
    return this.toResponseDTO(created);
  }

  async login(email: string, senhaRaw: string, ip_origem: string, user_agent?: string): Promise<{ token: string, user: AdminResponseDTO }> {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin || !admin.senha_hash) {
      throw AppError.unauthorized('Invalid credentials');
    }

    if (admin.status === 'inativo') {
      throw AppError.forbidden('Admin is inactive');
    }

    const isMatch = await bcrypt.compare(senhaRaw, admin.senha_hash);
    if (!isMatch) {
      throw AppError.unauthorized('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: admin.id_admin, role: 'admin' },
      env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '12h' }
    );

    // Create session
    const id_sessao = crypto.randomBytes(32).toString('hex');
    const data_expiracao = new Date();
    data_expiracao.setHours(data_expiracao.getHours() + 12);

    await this.sessaoRepository.create({
      id_sessao,
      id_admin: admin.id_admin!,
      ip_origem,
      user_agent,
      data_expiracao
    });

    return {
      token,
      user: this.toResponseDTO(admin)
    };
  }

  async getAdminById(id: number): Promise<AdminResponseDTO | null> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) throw AppError.notFound('Admin not found');
    return this.toResponseDTO(admin);
  }

  async getAllAdmins(): Promise<AdminResponseDTO[]> {
    const admins = await this.adminRepository.findAll();
    return admins.map(admin => this.toResponseDTO(admin));
  }

  async updateAdmin(id: number, data: UpdateAdminDTO): Promise<AdminResponseDTO> {
    const updateData: any = { ...data };
    
    if (data.senha) {
      updateData.senha_hash = await bcrypt.hash(data.senha, 10);
      delete updateData.senha;
    }

    const updated = await this.adminRepository.update(id, updateData);
    if (!updated) throw AppError.notFound('Admin not found');
    return this.toResponseDTO(updated);
  }

  async deleteAdmin(id: number): Promise<boolean> {
    // Check if it's the last admin
    const admins = await this.adminRepository.findAll();
    if (admins.length <= 1) {
      throw AppError.forbidden('Cannot delete the last admin');
    }
    
    const deleted = await this.adminRepository.delete(id);
    if (!deleted) throw AppError.notFound('Admin not found');
    return deleted;
  }

  private toResponseDTO(admin: Admin): AdminResponseDTO {
    const { senha_hash, ...rest } = admin as any;
    return rest as AdminResponseDTO;
  }
}
