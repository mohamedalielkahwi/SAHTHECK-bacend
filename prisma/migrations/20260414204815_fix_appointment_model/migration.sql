/*
  Warnings:

  - You are about to drop the column `date` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Appointment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[availabilityId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `specialistId` to the `AvailabeSlot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "date",
DROP COLUMN "time",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "AvailabeSlot" ADD COLUMN     "specialistId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_availabilityId_key" ON "Appointment"("availabilityId");

-- AddForeignKey
ALTER TABLE "AvailabeSlot" ADD CONSTRAINT "AvailabeSlot_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "Specialist"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
