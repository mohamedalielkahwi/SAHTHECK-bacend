export class GetFormeResponse {
  specialist: {
    data: {
      userId: number;
      fullName: string;
      email: string;
      specialist: {
        isValidated: boolean;
      };
    }[];
    count: number;
  };
  patient: {
    data: {
      userId: number;
      fullName: string;
      email: string;
    }[];
    count: number;
  };
  postNumber: number;
  medicalDocumentNumber: number;
}
