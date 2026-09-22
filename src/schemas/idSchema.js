import { z } from "zod";

export const idSchema = z.preprocess(
  (value) => {
    if (typeof value === "string" && /^\d+$/.test(value)) {
      return Number(value);
    }

    return value;
  },
  z
    .number()
    .int("ID deve ser um número inteiro")
    .positive("ID deve ser um número positivo")
    .max(2147483647, "ID excede o limite permitido"),
);
