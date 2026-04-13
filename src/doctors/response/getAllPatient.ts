export class getAllPatientsResponse {
    userId: number;
    fullName: string;
    email: string;
    gender: string;
    phone: string;
    patient: {
        age: number;
        height: number;
        weight: number;
        medicalHistory: {
            title: string;
            fileUrl: string;
            category: string;
        }[];
    }[];
}