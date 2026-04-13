/*
  Warnings:

  - You are about to drop the `Content` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('ARTICLE', 'VIDEO', 'IMAGE');

-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_publishedById_fkey";

-- DropTable
DROP TABLE "Content";

-- DropEnum
DROP TYPE "ContentType";

-- CreateTable
CREATE TABLE "Post" (
    "postId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "PostType" NOT NULL,
    "url" TEXT,
    "publishedById" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("postId")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_publishedById_fkey" FOREIGN KEY ("publishedById") REFERENCES "Specialist"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
