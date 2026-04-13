import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPosteDto } from './DTO/createPosteDto';
import { MinioService } from 'src/minio/minio.service';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService, private readonly minioService: MinioService) {}
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
            date: { gt: now },
          },
          {
            // Case 2: The date is today, so we check if the time is still to come
            date: now,
            time: { gt: now },
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
}
