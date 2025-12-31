import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { GlobalRole } from '@prisma/client';

@ApiTags('Areas')
@Controller('areas')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  @Roles(GlobalRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Crear área (Solo SUPER_ADMIN)' })
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areasService.create(
      createAreaDto.name,
      createAreaDto.code,
      createAreaDto.description,
    );
  }

  @Post('initialize')
  @Roles(GlobalRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Inicializar áreas por defecto (Solo SUPER_ADMIN)' })
  initializeDefaultAreas() {
    return this.areasService.initializeDefaultAreas();
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las áreas' })
  findAll() {
    return this.areasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener área por ID' })
  findOne(@Param('id') id: string) {
    return this.areasService.findOne(+id);
  }

  @Patch(':id')
  @Roles(GlobalRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Actualizar área (Solo SUPER_ADMIN)' })
  update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
    return this.areasService.update(
      +id,
      updateAreaDto.name,
      updateAreaDto.description,
    );
  }

  @Delete(':id')
  @Roles(GlobalRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Desactivar área (Solo SUPER_ADMIN)' })
  remove(@Param('id') id: string) {
    return this.areasService.deactivate(+id);
  }
}