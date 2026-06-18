-- AlterEnum
ALTER TYPE "StatusHospital" ADD VALUE 'pendente';

-- AlterTable
ALTER TABLE "hospital" ALTER COLUMN "status" SET DEFAULT 'pendente';
