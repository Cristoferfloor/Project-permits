import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { AreaPermission } from '@prisma/client';

export class UpdateUserAreaDto {
  @ApiProperty({
    example: ['READ', 'CREATE', 'UPDATE', 'DELETE'],
    enum: AreaPermission,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(AreaPermission, { each: true })
  permissions?: AreaPermission[];

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}