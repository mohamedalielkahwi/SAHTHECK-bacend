-- CreateEnum
CREATE TYPE "Security" AS ENUM ('MFA', 'SFA');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "security" "Security" DEFAULT 'SFA';
