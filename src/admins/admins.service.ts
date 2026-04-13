import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}
  async getForms() {
    const specialist = await this.prisma.user.findMany({
      where: {
        role: 'DOCTOR',
      },
      select: {
        userId: true,
        fullName: true,
        email: true,
        specialist: {
          select: {
            isValidated: true,
          },
        },
      },
    });
    const specialistCount = await this.prisma.user.count({
      where: {
        role: 'DOCTOR',
      },
    });
    const patient = await this.prisma.user.findMany({
      where: {
        role: 'PATIENT',
      },
      select: {
        userId: true,
        fullName: true,
        email: true,
      },
    });
    const patientCount = await this.prisma.user.count({
      where: {
        role: 'PATIENT',
      },
    });
    const postNumber = await this.prisma.post.count();
    const medicalDocumentNumber = await this.prisma.medicalDocument.count();
    return {
      specialist: { data: specialist, count: specialistCount },
      patient: { data: patient, count: patientCount },
      postNumber,
      medicalDocumentNumber,
    };
  }
  async getAllSpecialists() {
    const specialists = await this.prisma.user.findMany({
      where: {
        role: 'DOCTOR',
      },
      select: {
        userId: true,
        fullName: true,
        email: true,
        phone: true,
        imageUrl: true,
        gender: true,
        address: true,
        createdAt: true,
        specialist: {
          select: {
            isValidated: true,
            speciality: true,
            licenseNumber: true,
            clinic: true,
            location: true,
            rating: true,
            reviewsCount: true,
          },
        },
      },
    });
    const count = await this.prisma.user.count({
      where: {
        role: 'DOCTOR',
      },
    });
    return { data: specialists, count };
  }
  async getAllPatients() {
    const patients = await this.prisma.user.findMany({
      where: {
        role: 'PATIENT',
      },
      select: {
        userId: true,
        fullName: true,
        email: true,
        phone: true,
        imageUrl: true,
        gender: true,
        address: true,
        createdAt: true,
        patient: {
          select: {
            age: true,
            weight: true,
            height: true,
            appointments: {
              select: {
                reason: true,
                date: true,
                specialist: {
                  select: {
                    user: {
                      select: {
                        fullName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    const count = await this.prisma.user.count({
      where: {
        role: 'PATIENT',
      },
    });
    return { data: patients, count };
  }
}
