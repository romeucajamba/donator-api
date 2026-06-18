-- CreateEnum
CREATE TYPE "StatusAdmin" AS ENUM ('ativo', 'inativo');

-- AlterTable
ALTER TABLE "log_acesso" ADD COLUMN     "id_admin" INTEGER;

-- CreateTable
CREATE TABLE "admin" (
    "id_admin" SERIAL NOT NULL,
    "nome_completo" VARCHAR(100) NOT NULL,
    "email" VARCHAR(80) NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "status" "StatusAdmin" NOT NULL DEFAULT 'ativo',
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id_admin")
);

-- CreateTable
CREATE TABLE "sessao_admin_sistema" (
    "id_sessao" VARCHAR(64) NOT NULL,
    "id_admin" INTEGER NOT NULL,
    "ip_origem" VARCHAR(45) NOT NULL,
    "user_agent" VARCHAR(255),
    "data_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_expiracao" TIMESTAMP(3) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "sessao_admin_sistema_pkey" PRIMARY KEY ("id_sessao")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE INDEX "sessao_admin_sistema_id_admin_idx" ON "sessao_admin_sistema"("id_admin");

-- CreateIndex
CREATE INDEX "sessao_admin_sistema_ativo_idx" ON "sessao_admin_sistema"("ativo");

-- CreateIndex
CREATE INDEX "log_acesso_id_admin_idx" ON "log_acesso"("id_admin");

-- AddForeignKey
ALTER TABLE "log_acesso" ADD CONSTRAINT "log_acesso_id_admin_fkey" FOREIGN KEY ("id_admin") REFERENCES "admin"("id_admin") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessao_admin_sistema" ADD CONSTRAINT "sessao_admin_sistema_id_admin_fkey" FOREIGN KEY ("id_admin") REFERENCES "admin"("id_admin") ON DELETE RESTRICT ON UPDATE CASCADE;
