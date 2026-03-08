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
        description: 'The role of the user',
        example: 'user',
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
}