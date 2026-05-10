import { IDoadorRepository } from '@/domain/contracts/IDoadorRepository';
import { CreateDoadorDTO, UpdateDoadorDTO, DoadorResponseDTO } from '@/interfaces/dtos/DoadorDTO';
import { Doador } from '@/domain/entities/Doador';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '@/shared/error';
import { env } from '@/shared/env/env';
export class DoadorService {
  constructor(private doadorRepository: IDoadorRepository) {}

  async createDoador(data: CreateDoadorDTO): Promise<DoadorResponseDTO> {
    // Check if email or telefone already exists
    if (data.email) {
      const existingEmail = await this.doadorRepository.findByEmail(data.email);
      if (existingEmail) throw AppError.conflict('Email already in use');
    }

    const existingPhone = await this.doadorRepository.findByTelefone(data.telefone);
    if (existingPhone) throw AppError.conflict('Telefone already in use');

    // Hash password here
    const senha_hash = data.senha ? await bcrypt.hash(data.senha, 10) : '';

    const doadorEntity = new Doador({
      nome_completo: data.nome_completo,
      telefone: data.telefone,
      email: data.email,
      tipo_sanguineo: data.tipo_sanguineo,
      id_municipio: data.id_municipio,
      data_nascimento: data.data_nascimento,
      consentimento_sms: data.consentimento_sms,
      senha_hash
    });

    const created = await this.doadorRepository.create(doadorEntity);
    return this.toResponseDTO(created);
  }

  async getDoadorById(id: number): Promise<DoadorResponseDTO | null> {
    const doador = await this.doadorRepository.findById(id);
    if (!doador) throw AppError.notFound('Doador not found');
    return doador ? this.toResponseDTO(doador) : null;
  }

  async getAllDoadores(): Promise<DoadorResponseDTO[]> {
    const doadores = await this.doadorRepository.findAll();
    if (!doadores.length) throw AppError.notFound('No doadores found');
    return doadores.map(this.toResponseDTO);
  }

  async updateDoador(id: number, data: UpdateDoadorDTO): Promise<DoadorResponseDTO> {
    const updated = await this.doadorRepository.update(id, data);
    if (!updated) throw AppError.notFound('Doador not found');
    return this.toResponseDTO(updated);
  }

  async deleteDoador(id: number): Promise<boolean> {
    const deleted = await this.doadorRepository.delete(id);
    if (!deleted) throw AppError.notFound('Doador not found');
    return deleted;
  }

  async changePassword(id: number, currentSenha: string, newSenha: string): Promise<void> {
    const doador = await this.doadorRepository.findById(id);
    if (!doador || !doador.senha_hash) {
      throw AppError.notFound('Doador not found');
    }

    const isMatch = await bcrypt.compare(currentSenha, doador.senha_hash);
    if (!isMatch) {
      throw AppError.unauthorized('Current password is incorrect');
    }

    const newHash = await bcrypt.hash(newSenha, 10);
    await this.doadorRepository.update(id, { senha_hash: newHash });
  }

  async resetPassword(email: string, newSenha: string): Promise<void> {
    const doador = await this.doadorRepository.findByEmail(email);
    if (!doador) {
      throw AppError.notFound('Doador not found');
    }

    const newHash = await bcrypt.hash(newSenha, 10);
    await this.doadorRepository.update(doador.id_doador!, { senha_hash: newHash });
  }

  async getDoadorByEmail(email: string): Promise<DoadorResponseDTO | null> {
    const doador = await this.doadorRepository.findByEmail(email);
    if (!doador) throw AppError.notFound('Doador not found');
    return doador ? this.toResponseDTO(doador) : null;
  }

  async getDoadorByTelefone(telefone: string): Promise<DoadorResponseDTO | null> {
    const doador = await this.doadorRepository.findByTelefone(telefone);
    if (!doador) throw AppError.notFound('Doador not found');
    return doador ? this.toResponseDTO(doador) : null;
  }

  async login(email: string, senhaRaw: string): Promise<{ token: string, user: DoadorResponseDTO }> {
    const doador = await this.doadorRepository.findByEmail(email);
    if (!doador || !doador.senha_hash) {
      throw AppError.unauthorized('Credenciais inválidas');
    }

    const isMatch = await bcrypt.compare(senhaRaw, doador.senha_hash);
    if (!isMatch) {
      throw AppError.unauthorized('Credenciais inválidas');
    }

    const token = jwt.sign(
      { userId: doador.id_doador, role: 'doador' },
      env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    return {
      token,
      user: this.toResponseDTO(doador)
    };
  }

  private toResponseDTO(doador: Doador): DoadorResponseDTO {
    const { senha_hash, ...rest } = doador;
    return rest as DoadorResponseDTO;
  }
}
