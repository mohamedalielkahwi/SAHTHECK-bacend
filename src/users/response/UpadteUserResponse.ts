import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserResponse {
  @ApiProperty({
    description: 'The ID of the updated user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;
  @ApiProperty({
    description: 'The updated name of the user',
    example: 'John Doe',
  })
  fullName: string;

  @ApiProperty({
    description: 'The updated email of the user',
    example: 'test@test.tes',
  })
  email: string;

  @ApiProperty({
    description: 'The updated phone number of the user',
    example: '12345678',
  })
  phone: string;

  @ApiProperty({
    description: 'The updated address of the user',
    example: '123 Main Street, City, Country',
  })
  address: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'PATIENT',
  })
  role: string;

  @ApiProperty({
    description: 'The updated age of the Patient',
    example: { age: 30 }, // object not just 30
    nullable: true,
  })
  patient?: {
    age: number; // also fix: was string, should be number
  };

  @ApiProperty({
    description: 'The updated information of the Doctor',
    example: {
      // object not just "Cardiology"
      speciality: 'Cardiology',
      bio: 'Specialist in heart diseases',
      licenseNumber: '1234/95',
      isValidated: true,
    },
    nullable: true,
  })
  specialist: {
    speciality: string;
    bio: string;
    licenseNumber: string;
    isValidated: boolean;
  };

  @ApiProperty({
    description: 'The information of the Admin',
    example: { canModerate: true },
    nullable: true,
  })
  admin: {
    canModerate: boolean;
  };

  @ApiProperty({
    description: 'The new access token for the authenticated user',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  accessToken?: string;

  @ApiProperty({
    description: 'The new refresh token for the authenticated user',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  refreshToken?: string;
}
