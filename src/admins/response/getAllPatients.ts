export class getAllPatientsResponse {
    userId: number;
    fullName: string;
    email: string;
    phone: string;
    imageUrl: string;
    gender: string;
    address: string;
    createdAt: Date;
    patient:{
        age: number;
        weight: number;
        height: number;
        appointments:{
            reason: string;
            date: Date;
            specialist: {
                user: {
                    fullName: string;
                };
            };
        } [];
    }
    count: number
}