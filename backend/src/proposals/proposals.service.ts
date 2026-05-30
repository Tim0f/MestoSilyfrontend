import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ChatType,
  NotificationType,
  ProposalStatus,
  UserRole,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { RejectProposalDto } from './dto/reject-proposal.dto';

const proposalInclude = {
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
  reviewedBy: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
  chat: {
    select: {
      id: true,
      type: true,
      createdAt: true,
    },
  },
};

@Injectable()
export class ProposalsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateProposalDto) {
    return this.prisma.proposal.create({
      data: {
        userId,
        type: dto.type,
        title: dto.title,
        description: dto.description,
        wantsToLead: dto.wantsToLead,
      },
      include: proposalInclude,
    });
  }

  async findMyProposals(userId: string) {
    return this.prisma.proposal.findMany({
      where: { userId },
      include: proposalInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(status?: ProposalStatus) {
    return this.prisma.proposal.findMany({
      where: status ? { status } : undefined,
      include: proposalInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, role: UserRole) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: proposalInclude,
    });

    if (!proposal) {
      throw new NotFoundException('Предложение не найдено');
    }

    const isAdmin = role === UserRole.ADMIN || role === UserRole.ROOT;
    if (proposal.userId !== userId && !isAdmin) {
      throw new ForbiddenException('Нет доступа к этому предложению');
    }

    return proposal;
  }

  async approve(id: string, adminId: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    if (!proposal) {
      throw new NotFoundException('Предложение не найдено');
    }

    if (proposal.status !== ProposalStatus.PENDING) {
      throw new BadRequestException('Предложение уже рассмотрено');
    }

    const typeLabel = proposal.type === 'SECTION' ? 'секции' : 'мероприятия';
    const welcomeMessage = `Здравствуйте! Ваша идея «${proposal.title}» (${typeLabel}) одобрена. Давайте обсудим детали реализации.${
      proposal.wantsToLead
        ? ' Вы указали, что хотите проводить это сами — расскажите подробнее о своём опыте и видении.'
        : ''
    }`;

    const result = await this.prisma.$transaction(async (tx) => {
      const chat = await tx.chat.create({
        data: { type: ChatType.PROPOSAL },
      });

      await tx.chatParticipant.createMany({
        data: [
          { chatId: chat.id, userId: proposal.userId },
          { chatId: chat.id, userId: adminId },
        ],
      });

      await tx.chatMessage.create({
        data: {
          chatId: chat.id,
          authorId: adminId,
          content: welcomeMessage,
        },
      });

      const updatedProposal = await tx.proposal.update({
        where: { id },
        data: {
          status: ProposalStatus.APPROVED,
          reviewedById: adminId,
          reviewedAt: new Date(),
          chatId: chat.id,
        },
        include: proposalInclude,
      });

      await tx.notification.create({
        data: {
          userId: proposal.userId,
          type: NotificationType.PROPOSAL_APPROVED,
          title: 'Идея одобрена',
          message: `Ваше предложение «${proposal.title}» одобрено. Откройте чат для обсуждения деталей.`,
          proposalId: id,
        },
      });

      return updatedProposal;
    });

    return result;
  }

  async reject(id: string, adminId: string, dto: RejectProposalDto) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
    });

    if (!proposal) {
      throw new NotFoundException('Предложение не найдено');
    }

    if (proposal.status !== ProposalStatus.PENDING) {
      throw new BadRequestException('Предложение уже рассмотрено');
    }

    const rejectionMessage = dto.reviewComment
      ? `К сожалению, ваша идея «${proposal.title}» не была одобрена. Комментарий: ${dto.reviewComment}`
      : `К сожалению, ваша идея «${proposal.title}» не была одобрена.`;

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedProposal = await tx.proposal.update({
        where: { id },
        data: {
          status: ProposalStatus.REJECTED,
          reviewedById: adminId,
          reviewedAt: new Date(),
          reviewComment: dto.reviewComment,
        },
        include: proposalInclude,
      });

      await tx.notification.create({
        data: {
          userId: proposal.userId,
          type: NotificationType.PROPOSAL_REJECTED,
          title: 'Идея не одобрена',
          message: rejectionMessage,
          proposalId: id,
        },
      });

      return updatedProposal;
    });

    return result;
  }
}
