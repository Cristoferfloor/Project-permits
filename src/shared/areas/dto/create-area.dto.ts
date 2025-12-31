import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { AreaCode } from '@prisma/client';

export class CreateAreaDto {
  @ApiProperty({
    example: 'Desarrollo',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'DESARROLLO',
    enum: AreaCode,
  })
  @IsEnum(AreaCode)
  code: AreaCode;

  @ApiProperty({
    example: 'Área de desarrollo de software',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}