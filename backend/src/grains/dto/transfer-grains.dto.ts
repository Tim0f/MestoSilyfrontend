import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, IsNotEmpty } from 'class-validator';

export class TransferGrainsDto {
  @ApiProperty({
    description: 'ID пользователя-получателя',
    example: 'clxxxxxxxxxxxxxxxx',
  })
  @IsString()
  @IsNotEmpty()
  toUserId: string;

  @ApiProperty({
    description: 'Количество зерен для перевода',
    example: 50,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({
    description: 'Сообщение к переводу (необязательно)',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;
}
