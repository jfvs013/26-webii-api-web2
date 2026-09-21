import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.ts";

const isTest = process.env.NODE_ENV === "test";
const isDevelopment = process.env.NODE_ENV !== "production";

const connectionString = isTest
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL;

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
  log: isDevelopment ? ["query", "warn", "error"] : ["warn", "error"],
});

export default prisma;