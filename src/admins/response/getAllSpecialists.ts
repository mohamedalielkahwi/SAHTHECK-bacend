export class GetAllSpecialistsResponse {
    userId: number;
    fullName: string;
    email: string;
    phone: string;
    imageUrl: string;
    gender: string;
    address: string;
    createdAt: Date;
    specialist: {
      isValidated: boolean;
      speciality: string;
      licenseNumber: string; 
      clinic: string; 
      location:string;
      rating: number;
      reviewsCount: number;
    };
    count: number;
}