import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { UploadService } from '../upload/upload.service';

@ApiTags('Achievements')
@Controller('achievements')
export class AchievementsController {
  constructor(
    private readonly achievementsService: AchievementsService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ROOT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Создать достижение (только ROOT)' })
  create(@Body() createAchievementDto: CreateAchievementDto) {
    return this.achievementsService.create(createAchievementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список достижений' })
  @ApiQuery({ name: 'sectionId', required: false })
  findAll(@Query('sectionId') sectionId?: string) {
    return this.achievementsService.findAll(sectionId);
  }

  
@Get('my')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiOperation({ summary: 'Получить достижения текущего пользователя' })
async getMyAchievements(@Request() req) {
  // req.user должен содержать id (обычно req.user.id или req.user.userId)
  const userId = req.user?.id || req.user?.userId || req.user?.sub;
  if (!userId) {
    throw new BadRequestException('Не удалось определить пользователя');
  }
  return this.achievementsService.getUserAchievements(userId);
}

  @Get(':id')
  @ApiOperation({ summary: 'Получить достижение по ID' })
  findOne(@Param('id') id: string) {
    return this.achievementsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ROOT)
  @ApiBearerAuth('JWT-auth')
  update(
    @Param('id') id: string,
    @Body() updateAchievementDto: UpdateAchievementDto,
  ) {
    return this.achievementsService.update(id, updateAchievementDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ROOT)
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id') id: string) {
    return this.achievementsService.remove(id);
  }

  @Post('grant')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ROOT)
  @ApiBearerAuth('JWT-auth')
  grantAchievement(
    @Body() body: { achievementId: string; userId: string },
    @Request() req,
  ) {
    return this.achievementsService.grantAchievement(
      body.achievementId,
      body.userId,
      req.user.userId,
    );
  }

  @Patch(':id/icon')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async uploadIcon(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не загружен');
    }

    if (!this.uploadService.validateImage(file)) {
      throw new BadRequestException(
        'Допустимые форматы: JPEG, PNG, GIF, WEBP',
      );
    }

    const iconUrl = this.uploadService.getFileUrl(req, file.filename);

    return this.achievementsService.update(id, { iconUrl });
  }

  @Post('redeem/code')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
async redeemByCode(@Request() req, @Body() body: { code: string }) {
  const userId = req.user?.id || req.user?.userId || req.user?.sub;
  if (!userId) {
    throw new BadRequestException('Не удалось определить пользователя');
  }
  return this.achievementsService.redeemByCode(userId, body.code);
}

  @Post('redeem/qr')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  redeemByQr(@Request() req, @Body() body: { qrCode: string }) {
    return this.achievementsService.redeemByQr(req.user.id, body.qrCode);
  }

  @Post(':id/generate-code')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.ROOT)
@ApiBearerAuth('JWT-auth')
@ApiOperation({ summary: 'Сгенерировать новый код для выдачи достижения' })
async generateCode(@Param('id') id: string) {
  return this.achievementsService.generateCode(id);
}

}

