import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsArray, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { AreaPermission } from '@prisma/client';

export class AssignUserAreaDto {
  @ApiProperty({
    example: 1,
    description: 'ID del usuario',
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'ID del área',
  })
  @IsInt()
  areaId: number;

  @ApiProperty({
    example: ['READ', 'CREATE', 'UPDATE'],
    enum: AreaPermission,
    isArray: true,
  })
  @IsArray()
  @IsEnum(AreaPermission, { each: true })
  permissions: AreaPermission[];

  @ApiProperty({
    example: false,
    required: false,
    description: 'Si el usuario será admin del área',
  })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}