import { Admin } from '@/domain/entities/Admin';

export interface IAdminRepository {
  create(admin: Admin): Promise<Admin>;
  findById(id: number): Promise<Admin | null>;
  findByEmail(email: string): Promise<Admin | null>;
  findAll(): Promise<Admin[]>;
  update(id: number, data: Partial<Admin>): Promise<Admin | null>;
  delete(id: number): Promise<boolean>;
}
