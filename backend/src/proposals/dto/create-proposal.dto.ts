import { ApiProperty } from '@nestjs/swagger';
import { ProposalType } from '@prisma/client';
import { IsBoolean, IsEnum, IsString, MinLength } from 'class-validator';

export class CreateProposalDto {
  @ApiProperty({ enum: ProposalType, description: 'Тип предложения: секция или мероприятие' })
  @IsEnum(ProposalType)
  type: ProposalType;

  @ApiProperty({ description: 'Название секции или мероприятия' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ description: 'Описание идеи' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ description: 'Хочет ли пользователь сам проводить секцию/мероприятие' })
  @IsBoolean()
  wantsToLead: boolean;
}
