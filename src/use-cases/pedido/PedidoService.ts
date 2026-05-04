import { IPedidoRepository } from '@/domain/contracts/IPedidoRepository';
import { IPedidoDoacaoRepository } from '@/domain/contracts/IPedidoDoacaoRepository';
import { IPedidoEntreHospitaisRepository } from '@/domain/contracts/IPedidoEntreHospitaisRepository';
import { Pedido } from '@/domain/entities/Pedido';
import { PedidoDoacao } from '@/domain/entities/PedidoDoacao';
import { PedidoEntreHospitais } from '@/domain/entities/PedidoEntreHospitais';
import {
  CreatePedidoDTO, UpdatePedidoDTO, PedidoResponseDTO,
  CreatePedidoDoacaoDTO, UpdatePedidoDoacaoDTO, PedidoDoacaoResponseDTO,
  CreatePedidoEntreHospitaisDTO, UpdatePedidoEntreHospitaisDTO, PedidoEntreHospitaisResponseDTO
} from '../../interfaces/dtos/PedidoDTO';
import { AppError } from '@/shared/error';

export class PedidoService {
  constructor(
    private pedidoRepository: IPedidoRepository,
    private pedidoDoacaoRepository: IPedidoDoacaoRepository,
    private pedidoEntreHospitaisRepository: IPedidoEntreHospitaisRepository
  ) {}

  // === PEDIDO (URGÊNCIA/SMS) ===
  async createPedido(data: CreatePedidoDTO): Promise<PedidoResponseDTO> {
    const pedido = new Pedido(data);
    const created = await this.pedidoRepository.create(pedido);
    return created as PedidoResponseDTO;
  }

  async updatePedido(id: number, data: UpdatePedidoDTO): Promise<PedidoResponseDTO> {
    const updated = await this.pedidoRepository.update(id, data);
    return updated as PedidoResponseDTO;
  }

  async getHospitalPedidos(id_hospital: number): Promise<PedidoResponseDTO[]> {
    const pedidos = await this.pedidoRepository.findAllByHospital(id_hospital);
    if (!pedidos.length) throw AppError.notFound('No pedidos found for this hospital');
    return pedidos as PedidoResponseDTO[];
  }

  async getAllPedidos(): Promise<PedidoResponseDTO[]> {
    const pedidos = await this.pedidoRepository.findAll();
    if (!pedidos.length) throw AppError.notFound('No pedidos found');
    return pedidos as PedidoResponseDTO[];
  }

  async deletePedido(id: number): Promise<boolean> {
    return await this.pedidoRepository.delete(id);
  }

  async getPedidoById(id: number): Promise<PedidoResponseDTO | null> {
    const pedido = await this.pedidoRepository.findById(id);
    if (!pedido) throw AppError.notFound('Pedido not found');
    return pedido as PedidoResponseDTO | null;
  }

  // === PEDIDO DOAÇÃO (Doador -> Hospital) ===
  async requestDoacao(data: CreatePedidoDoacaoDTO): Promise<PedidoDoacaoResponseDTO> {
    const pedido = new PedidoDoacao(data);
    const created = await this.pedidoDoacaoRepository.create(pedido);
    return created as PedidoDoacaoResponseDTO;
  }

  async getPedidoDoacaoById(id: number): Promise<PedidoDoacaoResponseDTO | null> {
    const pedido = await this.pedidoDoacaoRepository.findById(id);
    if (!pedido) throw AppError.notFound('Pedido de doação not found');
    return pedido as PedidoDoacaoResponseDTO | null;
  }

  async answerPedidoDoacao(id: number, data: { status: 'aceite' | 'rejeitado'; data_resposta: Date }) {
    const updated = await this.pedidoDoacaoRepository.answer(id, data);
    return updated;
  }
  
  async getDoacoesByDoador(id_doador: number): Promise<PedidoDoacaoResponseDTO[]> {
    const pedidos = await this.pedidoDoacaoRepository.findAllByDoador(id_doador);
    if (!pedidos.length) throw AppError.notFound('No pedidos de doação found for this doador');
    return pedidos as PedidoDoacaoResponseDTO[];
  }

  async getDoacoesByHospital(id_hospital: number): Promise<PedidoDoacaoResponseDTO[]> {
    const pedidos = await this.pedidoDoacaoRepository.findAllByHospital(id_hospital);
    if (!pedidos.length) throw AppError.notFound('No pedidos de doação found for this hospital');
    return pedidos as PedidoDoacaoResponseDTO[];
  }

  async getAllDoacoes(): Promise<PedidoDoacaoResponseDTO[]> {
    const pedidos = await this.pedidoDoacaoRepository.findAll();
    if (!pedidos.length) throw AppError.notFound('No pedidos de doação found');
    return pedidos as PedidoDoacaoResponseDTO[];
  }

  async deletePedidoDoacao(id: number): Promise<boolean> {
    return await this.pedidoDoacaoRepository.delete(id);
  }

  // === PEDIDO ENTRE HOSPITAIS ===
  async requestBolsas(data: CreatePedidoEntreHospitaisDTO): Promise<PedidoEntreHospitaisResponseDTO> {
    const pedido = new PedidoEntreHospitais(data);
    const created = await this.pedidoEntreHospitaisRepository.create(pedido);
    return created as PedidoEntreHospitaisResponseDTO;
  }

  async answerPedidoBolsas(id: number, data: UpdatePedidoEntreHospitaisDTO): Promise<PedidoEntreHospitaisResponseDTO> {
    const updated = await this.pedidoEntreHospitaisRepository.update(id, data);
    return updated as PedidoEntreHospitaisResponseDTO;
  }

  async deletePedidoEntreHospitais(id: number): Promise<boolean> {
    return await this.pedidoEntreHospitaisRepository.delete(id);
  }

  async getPedidoEntreHospitaisById(id_pedido_entre: number): Promise<PedidoEntreHospitais | null> {
    const pedido = await this.pedidoEntreHospitaisRepository.findById(id_pedido_entre);
    if (!pedido) throw AppError.notFound('Pedido entre hospitais not found');
    return pedido;
  }

  async getAllBySolicitante(id_solicitante: number): Promise<PedidoEntreHospitais[]> {
    const pedidos = await this.pedidoEntreHospitaisRepository.findAllBySolicitante(id_solicitante);
    if (!pedidos.length) throw AppError.notFound('No pedidos found for this solicitante');
    return pedidos;
  }

  async getAllByFornecedor(id_fornecedor: number): Promise<PedidoEntreHospitais[]> {
    const pedidos = await this.pedidoEntreHospitaisRepository.findAllByFornecedor(id_fornecedor);
    if (!pedidos.length) throw AppError.notFound('No pedidos found for this fornecedor');
    return pedidos;
  }

  async getAll(): Promise<PedidoEntreHospitais[]> {
    const pedidos = await this.pedidoEntreHospitaisRepository.findAll();
    
    if (!pedidos.length) throw AppError.notFound('No pedidos found');
    return pedidos;
  }
}
