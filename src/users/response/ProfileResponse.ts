import { ApiProperty } from "@nestjs/swagger";

export class ProfileResponse {
    @ApiProperty({
        description: 'The unique identifier of the user',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    userId: string;

    @ApiProperty({
        description: 'The full name of the user',
        example: 'John Doe',
    })
    fullName: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'test@test.tes',
    })
    email: string;

    @ApiProperty({
        description: 'The phone number of the user',
        example: '12345678',
    })
    phone: string;

    @ApiProperty({
        description: 'The address of the user',
        example: '123 Main Street, City, Country',
    })
    address: string;

    @ApiProperty({
        description: 'The role of the user',
        example: 'PATIENT',
    })
    role: string;
    
    @ApiProperty({
        description: 'The patient details',
        example: {
            age: 30,
        },
    })
    patient: {
        age: number;
    };

    @ApiProperty({
        description: 'The specialist details',
        example: {
            speciality: 'Cardiology',
            bio: 'Specialist in heart diseases',
            licenseNumber: '1234567890',
            isValidated: true,
        },
    })
    specialist: {
        speciality: string;
        bio: string;
        licenseNumber: string;
        isValidated: boolean;
    };

    @ApiProperty({
        description: 'The admin details',
        example: {
            canModerate: true,
        },
    })
    admin: {
        canModerate: boolean;
    };
}