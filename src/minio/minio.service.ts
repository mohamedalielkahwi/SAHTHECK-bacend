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
      pathStyle: true, // 👈 important for localhost
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

      // only profile-images folder is public, rest is private
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [
              `arn:aws:s3:::${this.bucket}/profile-images/*`,
              `arn:aws:s3:::${this.bucket}/posts/*`,
            ], // 👈 only this folder
          },
        ],
      };

      await this.client.setBucketPolicy(this.bucket, JSON.stringify(policy));
      console.log(`Bucket policy set: profile-images public, rest private`);
    } catch (error) {
      console.error('MinIO initialization error:', error.message);
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;

    await this.client.putObject(this.bucket, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    return `http://${process.env.MINIO_PUBLIC_URL}:${process.env.MINIO_PORT}/${this.bucket}/${fileName}`;
  }

  // Upload a private file and return the object name (key) only — do not expose a public URL
  async uploadPrivateFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    const objectName = `${folder}/${Date.now()}-${file.originalname}`;

    await this.client.putObject(
      this.bucket,
      objectName,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );

    return objectName;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const fileName = fileUrl.split(`/${this.bucket}/`)[1];
    await this.client.removeObject(this.bucket, fileName);
  }

  // Remove object by its object name (key)
  async removeObjectByName(objectName: string): Promise<void> {
    await this.client.removeObject(this.bucket, objectName);
  }

  // Get presigned URL by passing the full public file URL (keeps backward compatibility)
  async getPresignedUrl(
    fileUrl: string,
    expirySeconds = 3600,
  ): Promise<string> {
    const fileName = fileUrl.split(`/${this.bucket}/`)[1];
    return this.client.presignedGetObject(this.bucket, fileName, expirySeconds);
  }

  // Get presigned URL directly from object name (preferred for private files)
  async getPresignedUrlByObjectName(
    objectName: string,
    expirySeconds = 3600,
  ): Promise<string> {
    return this.client.presignedGetObject(
      this.bucket,
      objectName,
      expirySeconds,
    );
  }
}
