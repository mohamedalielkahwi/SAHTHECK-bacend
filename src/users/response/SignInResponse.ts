import { ApiProperty } from '@nestjs/swagger';

export class SignInResponse {
  @ApiProperty({
    description: 'The access token for the authenticated user',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  accessToken: string;

  @ApiProperty({
    description: 'The refresh token for the authenticated user',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'The user ID of the authenticated user',
    example: '1234567890',
  })
  userId: string;

  @ApiProperty({
    description: 'The email of the authenticated user',
    example: 'Kp4wW@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The role of the authenticated user',
    example: 'Patient',
  })
  role: string;

  @ApiProperty({
    example: 'http://localhost:9000/sahteck/profile-images/123.jpg',
    nullable: true,
  })
  imageUrl?: string;
}
