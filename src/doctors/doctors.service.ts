import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPosteDto } from './DTO/createPosteDto';
import { MinioService } from 'src/minio/minio.service';
import { CreateDailySlotsDto } from './DTO/createDailySlotsDto';
import { ModifyApointmentDto } from './DTO/ModifyApointmentDto';
import { UpdateDailySlotsDto } from './DTO/updateDailySlotsDto';
import { CreateMedicalDocumentDto } from './DTO/createMedicalDocumendDto';

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
    let { date, startTime, endTime, place } = createDailySlotsDto;
    const user = await this.prisma.user.findFirst({
      where: { userId },
    });
    if (!user) throw new ConflictException('User not found');

    // Ensure date is a proper Date object set to midnight
    const dateObject = new Date(date);
    dateObject.setHours(0, 0, 0, 0);

    // Convert startTime and endTime to Date objects for the query
    const startTimeDate = new Date(dateObject);
    startTimeDate.setHours(startTime, 0, 0, 0);
    const endTimeDate = new Date(dateObject);
    endTimeDate.setHours(endTime, 0, 0, 0);

    const existingSlots = await this.prisma.availabeSlot.findMany({
      where: {
        specialistId: userId,
        date: dateObject,
        // Any overlap with the requested range
        startTime: {
          lt: endTimeDate,
        },
        endTime: {
          gt: startTimeDate,
        },
      },
      select: {
        startTime: true,
      },
    });

    const existingStartTimes = new Set(
      existingSlots.map((slot) => slot.startTime.getTime()),
    );
    const slots: {
      specialistId: string;
      startTime: Date;
      endTime: Date;
      date: Date;
      place: string;
    }[] = [];
    const slotDuration = 1;
    for (let hour = startTime; hour < endTime; hour++) {
      const slotStart = new Date(dateObject);
      slotStart.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(dateObject);
      slotEnd.setHours(hour + slotDuration, 0, 0, 0);

      if (existingStartTimes.has(slotStart.getTime())) {
        continue;
      }

      slots.push({
        specialistId: userId,
        startTime: slotStart,
        endTime: slotEnd,
        date: dateObject,
        place: place,
      });
    }

    if (slots.length === 0) {
      return { count: 0 };
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

  async updateDailySlots(userId: string, body: UpdateDailySlotsDto, id: string) {
    const { date, startTime, endTime, place , isBooked} = body;
    const dateObject = new Date(date);
    dateObject.setHours(0, 0, 0, 0);
    const startTimeDate = new Date(dateObject);
    startTimeDate.setHours(startTime, 0, 0, 0);
    const endTimeDate = new Date(dateObject);
    endTimeDate.setHours(endTime, 0, 0, 0);
    const slot = await this.prisma.availabeSlot.findFirst({
      where:{
        specialistId: userId,
        date: dateObject,
        startTime: startTimeDate,
        endTime: endTimeDate,
        isBooked: isBooked,
      }
    })
    console.log(slot)
    if (slot) throw new ConflictException('Slot already exists with the same date and time');
    return this.prisma.availabeSlot.update({
      where: {
        availabilityId: id,
        specialistId: userId,
      },
      data: {
        date: dateObject,
        startTime: startTimeDate,
        endTime: endTimeDate,
        place,
        isBooked,
      },
    });
  }

  async deleteDailySlots(userId: string, id: string) {

    const slot = await this.prisma.availabeSlot.findFirst({
      where: {
        availabilityId: id,
        specialistId: userId,      },
    });
    if (!slot) throw new ConflictException('Slot or user not found');
    return this.prisma.availabeSlot.delete({
      where: {
        availabilityId: id,
        specialistId: userId,
      },
    });
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
    });
    if (!appointment) throw new ConflictException('Appointment not found');
    await this.prisma.appointment.update({
      where: { appointmentId },
      data: { status: status as any },
    });
    if (status === 'REJECTED') {
      await this.prisma.availabeSlot.update({
        where: { availabilityId: appointment.availabilityId },
        data: { isBooked: false },
      });
    }
    return { message: 'Appointment modified successfully', status };
  }

  async addDocument(doctorId: string, patientId: string, file: Express.Multer.File, body: CreateMedicalDocumentDto) {
    const patient = await this.prisma.user.findFirst({
      where: {
        userId: patientId,
      },
    });
    if (!patient) throw new ConflictException('Patient not found');
    const folder = `medical-documents/${patientId}`;
    const fileUrl = await this.minioService.uploadFile(file, folder);
    return this.prisma.medicalDocument.create({
      data: {
        userId: patientId,
        fileUrl: fileUrl,
        ...body,
      },
    });
  }

  async getDocuments(doctorId: string, patientId: string) {
    const patient = await this.prisma.user.findFirst({
      where: {
        userId: patientId,      },
    });
    if (!patient) throw new ConflictException('Patient not found');
    return this.prisma.medicalDocument.findMany({
      where: {
        userId: patientId,
      },
    });
  }
}
