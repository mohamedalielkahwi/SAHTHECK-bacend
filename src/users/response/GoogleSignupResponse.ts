import { ApiProperty } from '@nestjs/swagger';

export class GoogleSignupResponse {
  @ApiProperty({ example: 'eyJ...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJ...' })
  refreshToken: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ example: 'john@gmail.com' })
  email: string;

  @ApiProperty({ example: 'PATIENT' })
  role: string;

  @ApiProperty({
    example: 'http://localhost:9000/sahteck/profile-images/123.jpg',
    nullable: true,
  })
  imageUrl?: string;

  @ApiProperty({ example: false })
  isNew: boolean;
}
