// proposals.frontend.ts

import { HttpClient } from './httpClient';

// ===================== Enums & Types =====================

export enum ProposalType {
  SECTION = 'SECTION',
  EVENT = 'EVENT',
}

export enum ProposalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface ProposalUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ProposalReviewer {
  id: string;
  firstName: string;
  lastName: string;
}

export interface ProposalChat {
  id: string;
  type: string;
  createdAt: string;
}

export interface Proposal {
  id: string;
  type: ProposalType;
  title: string;
  description: string;
  wantsToLead: boolean;
  status: ProposalStatus;
  reviewComment?: string | null;
  userId: string;
  reviewedById?: string | null;
  reviewedAt?: string | null;
  chatId?: string | null;
  createdAt: string;
  updatedAt: string;
  user: ProposalUser;
  reviewedBy?: ProposalReviewer | null;
  chat?: ProposalChat | null;
}

// ===================== DTOs =====================

export interface CreateProposalDto {
  type: ProposalType;
  title: string;
  description: string;
  wantsToLead: boolean;
}

export interface RejectProposalDto {
  reviewComment?: string;
}

// ===================== Service =====================

export class ProposalsFrontendService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Отправить новое предложение (секции или мероприятия).
   */
create<T = Proposal>(dto: CreateProposalDto) {
  const payload = {
    ...dto,
    wantsToLead: Boolean(dto.wantsToLead),   // принудительно булево
  };
  return this.http.post<T>('/proposals', payload);
}

  /**
   * Получить все свои предложения.
   */
  getMyProposals<T = Proposal[]>() {
    return this.http.get<T>('/proposals/my');
  }

  /**
   * Получить все предложения (только для администраторов).
   * Можно отфильтровать по статусу.
   */
  findAll<T = Proposal[]>(status?: ProposalStatus) {
    const query = status ? `?status=${status}` : '';
    return this.http.get<T>(`/proposals${query}`);
  }

  /**
   * Получить одно предложение по ID.
   */
  findOne<T = Proposal>(id: string) {
    return this.http.get<T>(`/proposals/${id}`);
  }

  /**
   * Одобрить предложение (только администратор).
   */
  approve<T = Proposal>(id: string) {
    return this.http.patch<T>(`/proposals/${id}/approve`, {});
  }

  /**
   * Отклонить предложение с комментарием (только администратор).
   */
  reject<T = Proposal>(id: string, dto: RejectProposalDto) {
    return this.http.patch<T>(`/proposals/${id}/reject`, dto);
  }
}