import "dotenv/config";
import { z } from "zod";

const schemaEnv = z.object({
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(["mysql", "pg", "sqlite"]).default("pg"),
  JWT_SECRET: z.string(),
  API_PUBLIC_URL: z.string(),
  ENVOIRONMENT: z.enum(["development", "production", "test"]).default("development"),
  SECRET_KEY: z.string(),
  ALLOWED_HOSTS: z.string(),
  API_JWT_ECDSA_PRIVATE_KEY: z.string(),
  API_JWT_ECDSA_PUBLIC_KEY: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  API_DOMAIN_COOKIE: z.string().default("localhost"),
  DONATOR_SERVER_ENV_API: z.enum(["staging", "production", "development"]).default("development"),
  OMBALA_BASE_URL: z.string(),
  OMBALA_API_TOKEN: z.string(),
  OMBALA_FROM: z.string(),
});

const _env = schemaEnv.safeParse(process.env);

if (_env.success == false) {
  console.error("Variáveis de ambiente inválida❌", _env.error.format());

  throw new Error("Variáveis de ambiente inválida❌");
}

export const env = _env.data;