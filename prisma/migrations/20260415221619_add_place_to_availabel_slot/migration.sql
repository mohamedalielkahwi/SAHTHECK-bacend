/*
  Warnings:

  - You are about to drop the column `place` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `place` to the `AvailabeSlot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "place";

-- AlterTable
ALTER TABLE "AvailabeSlot" ADD COLUMN     "place" TEXT NOT NULL;
