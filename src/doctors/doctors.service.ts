import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPosteDto } from './DTO/createPosteDto';
import { MinioService } from 'src/minio/minio.service';
import { CreateDailySlotsDto } from './DTO/createDailySlotsDto';
import { ModifyApointmentDto } from './DTO/ModifyApointmentDto';

@Injectable()
export class DoctorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
  ) {}
  async getPatients(doctorId: string) {
    const patients = await this.prisma.user.findMany({
      where: {
        role: 'PATIENT',
        patient: {
          appointments: {
            every: {
              specialistId: doctorId,
            },
          },
        },
      },
      select: {
        userId: true,
        fullName: true,
        email: true,
        gender: true,
        phone: true,
        patient: {
          select: {
            age: true,
            height: true,
            weight: true,
            medicalHistory: {
              select: {
                title: true,
                fileUrl: true,
                category: true,
              },
            },
          },
        },
      },
    });
    const count = await this.prisma.user.count({
      where: {
        role: 'PATIENT',
        patient: {
          appointments: {
            every: {
              specialistId: doctorId,
            },
          },
        },
      },
    });
    return { patients, count };
  }

  async getForms(doctorId: string) {
    const patientsCount = await this.prisma.user.count({
      where: {
        role: 'PATIENT',
        patient: {
          appointments: {
            every: {
              specialistId: doctorId,
            },
          },
        },
      },
    });

    const now = new Date();

    const appointmentsCount = await this.prisma.appointment.count({
      where: {
        specialistId: doctorId,
        OR: [
          {
            // Case 1: The date is strictly in the future (tomorrow or later)
            AvailableSlot: {
              date: { gt: now },
              isBooked: true,
            },
          },
          {
            // Case 2: The date is today, so we check if the time is still to come
            AvailableSlot: {
              date: now,
              startTime: { gt: now },
              isBooked: true,
            },
          },
        ],
      },
    });
    return { patientsCount, appointmentsCount };
  }

  async getMyPosts(doctorId: string) {
    const posts = await this.prisma.post.findMany({
      where: {
        publishedById: doctorId,
      },
      select: {
        postId: true,
        title: true,
        description: true,
        createdAt: true,
        type: true,
        url: true,
        isPublished: true,
      },
    });
    const count = await this.prisma.post.count({
      where: {
        publishedById: doctorId,
      },
    });
    return { posts, count };
  }

  async createPost(
    doctorId: string,
    dto: createPosteDto,
    file?: Express.Multer.File,
  ) {
    let fileUrl: string | null = null;

    if (file) {
      // folder structure: posts/{doctorId}/filename
      // MinioService.uploadFile will create folders automatically
      // since MinIO uses flat key structure with / as separator
      const folder = `posts/${doctorId}`;
      fileUrl = await this.minioService.uploadFile(file, folder);
    }

    const post = await this.prisma.post.create({
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type as any,
        url: fileUrl ?? '',
        publishedById: doctorId,
        isPublished: false,
      },
      select: {
        postId: true,
        title: true,
        description: true,
        type: true,
        url: true,
        isPublished: true,
        createdAt: true,
      },
    });

    return post;
  }

  async createADailySlots(
    userId: string,
    createDailySlotsDto: CreateDailySlotsDto,
  ) {
    let { date, startTime, endTime , place} = createDailySlotsDto;
    const user = await this.prisma.user.findFirst({
      where: { userId },
    });
    if (!user) throw new ConflictException('User not found');
    const slots: {
      specialistId: string;
      startTime: Date;
      endTime: Date;
      date: Date;
      place: string;
    }[] = [];
    const slotDuration = 1;
    // Ensure date is a proper Date object set to midnight
    const dateObject = new Date(date);
    dateObject.setHours(0, 0, 0, 0);
    for (let hour = startTime; hour < endTime; hour++) {
      const slotStart = new Date(dateObject);
      slotStart.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(dateObject);
      slotEnd.setHours(hour + slotDuration, 0, 0, 0);
      slots.push({
        specialistId: userId,
        startTime: slotStart,
        endTime: slotEnd,
        date: dateObject,
        place: place,
      });
    }
    return this.prisma.availabeSlot.createMany({
      data: slots,
    });
  }

  async getDailySlots(userId: string) {
    const now = new Date();
    const slots = await this.prisma.availabeSlot.findMany({
      where: {
        specialistId: userId,
        date: { gte: now },
        isBooked: false,
      },
      select: {
        availabilityId: true,
        date: true,
        startTime: true,
        endTime: true,
        isBooked: true,
        place: true,
      },
    });
    return slots;
  }

  async getAppointments(doctorId: string) {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        specialistId: doctorId,
      },
      select: {
        appointmentId: true,
        status: true,
        reason: true,
        AvailableSlot: {
          select: {
            date: true,
            startTime: true,
            endTime: true,
            place: true,
          },
        },
        patient: {
          select: {
            user: {
              select: {
                fullName: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });
    return appointments;
  }

  async modifyAppointment(doctorId: string, body: ModifyApointmentDto) {
    const { appointmentId, status } = body;
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        appointmentId,
        specialistId: doctorId,
      },
    })
    if (!appointment) throw new ConflictException('Appointment not found');
    await this.prisma.appointment.update({
      where: { appointmentId },
      data: { status: status as any },
    });
    if (status === 'REJECTED' ) {
      await this.prisma.availabeSlot.update({
        where: { availabilityId: appointment.availabilityId },
        data: { isBooked: false },
      });
    }
    return { message: 'Appointment modified successfully' ,status};
  }
}
