-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "assignedToId" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "exerciseTolerance" TEXT;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Patient"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
