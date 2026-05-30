import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ProposalStatus, UserRole } from '@prisma/client';
import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { RejectProposalDto } from './dto/reject-proposal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Proposals')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post()
  @ApiOperation({ summary: 'Отправить предложение секции или мероприятия' })
  create(@CurrentUser() user: any, @Body() dto: CreateProposalDto) {
    return this.proposalsService.create(user.userId, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Мои предложения' })
  findMy(@CurrentUser() user: any) {
    return this.proposalsService.findMyProposals(user.userId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ROOT)
  @ApiOperation({ summary: 'Все предложения (только администраторы)' })
  @ApiQuery({ name: 'status', required: false, enum: ProposalStatus })
  findAll(@Query('status') status?: ProposalStatus) {
    return this.proposalsService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить предложение по ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.proposalsService.findOne(id, user.userId, user.role);
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ROOT)
  @ApiOperation({ summary: 'Одобрить предложение и создать чат для обсуждения' })
  approve(@Param('id') id: string, @CurrentUser() user: any) {
    return this.proposalsService.approve(id, user.userId);
  }

  @Patch(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ROOT)
  @ApiOperation({ summary: 'Отклонить предложение и уведомить пользователя' })
  reject(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: RejectProposalDto,
  ) {
    return this.proposalsService.reject(id, user.userId, dto);
  }
}
