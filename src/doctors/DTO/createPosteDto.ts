import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class createPosteDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'Healthy Eating Tips',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

    @ApiProperty({
      description: 'The description of the post',
      example: 'Healthy Eating Tips',
    })
    @IsNotEmpty()
    @IsString()
  description: string;

    @ApiProperty({
      description: 'The type of the post',
      example: 'ARTICLE',
    })
    @IsNotEmpty()
    @IsString()
  type: 'ARTICLE' | 'VIDEO' | 'IMAGE';
}
