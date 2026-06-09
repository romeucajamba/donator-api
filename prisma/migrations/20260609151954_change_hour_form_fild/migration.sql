-- AlterTable
ALTER TABLE "agenda" ALTER COLUMN "hora_agendada" DROP NOT NULL,
ALTER COLUMN "hora_agendada" SET DATA TYPE TEXT;
