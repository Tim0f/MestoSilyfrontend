import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RejectProposalDto {
  @ApiPropertyOptional({ description: 'Комментарий администратора при отклонении' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reviewComment?: string;
}
