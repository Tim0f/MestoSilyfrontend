import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({ example: 'Шахматы', description: 'Название секции' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Обучение игре в шахматы',
    description: 'Описание',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL изображения секции',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    example: 'https://example.com/icon.png',
    description: 'URL иконки секции',
    required: false,
  })
  @IsOptional()
  @IsString()
  iconUrl?: string;

  @ApiProperty({ example: 12, description: 'Минимальный возраст' })
  @IsInt()
  @Min(5)
  @Max(20)
  ageMin: number;

  @ApiProperty({ example: 17, description: 'Максимальный возраст' })
  @IsInt()
  @Min(5)
  @Max(20)
  ageMax: number;

  @ApiProperty({
    example: 20,
    description: 'Максимальное количество участников',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxParticipants?: number;

  @ApiProperty({ example: true, description: 'Активна', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: 'https://drive.google.com/drive/folders/...',
    description: 'Ссылка на Google Drive с галереей',
    required: false,
  })
  @IsOptional()
  @IsString()
  galleryDriveUrl?: string;

  @ApiProperty({
    example: 1500,
    description: 'Стоимость одного занятия для секции (в условных единицах/руб.)',
  })
  @IsInt()
  @Min(0)
  price: number;

  // -------------------------
  // 🔥 Новое поле
  // -------------------------
  @ApiProperty({
    example: ['uuid1', 'uuid2'],
    description: 'ID учителей, назначенных к секции',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // вместо IsUUID
  teacherIds?: string[];
}
