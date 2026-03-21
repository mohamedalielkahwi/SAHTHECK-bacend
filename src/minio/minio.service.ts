import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly client: Minio.Client;
  private readonly bucket: string;

  constructor() {
    this.client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: Number(process.env.MINIO_PORT),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
    this.bucket = process.env.MINIO_BUCKET_NAME || 'sahteck';
  }

  async onModuleInit() {
    try {
      const exists = await this.client.bucketExists(this.bucket);
      if (!exists) {
        await this.client.makeBucket(this.bucket);
        console.log(`Bucket ${this.bucket} created`);
      }
    } catch (error) {
      console.error('MinIO connection failed:', error.message);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: 'profile-images' | 'medical-documents' | 'videos',
  ): Promise<string> {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;

    await this.client.putObject(this.bucket, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    return `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${this.bucket}/${fileName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const fileName = fileUrl.split(`/${this.bucket}/`)[1];
    await this.client.removeObject(this.bucket, fileName);
  }

  async getPresignedUrl(
    fileUrl: string,
    expirySeconds = 3600,
  ): Promise<string> {
    const fileName = fileUrl.split(`/${this.bucket}/`)[1];
    return this.client.presignedGetObject(this.bucket, fileName, expirySeconds);
  }
}
