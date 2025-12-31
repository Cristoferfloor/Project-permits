import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateAreaDto {
  @ApiProperty({
    example: 'Desarrollo Backend',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Área de desarrollo de backend',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}