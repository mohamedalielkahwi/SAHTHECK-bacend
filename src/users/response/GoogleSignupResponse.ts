import { ApiProperty } from '@nestjs/swagger';

export class GoogleSignupResponse {
  @ApiProperty({
    description: 'The access token for the authenticated user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'The refresh token for the authenticated user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Indicates if the user is newly created and needs to complete their profile',
    example: true,
    required: false,
  })
  isNew?: boolean;
}