import { z } from "zod";
import { idSchema } from "./idSchema.js";

const enunciadoSchema = z
  .string()
  .trim()
  .min(3, "Enunciado deve ter pelo menos 3 caracteres")
  .max(500, "Enunciado deve ter no máximo 500 caracteres");

const dificuldadeSchema = z.preprocess(
  (value) => {
    if (typeof value === "string" && /^\d+$/.test(value)) {
      return Number(value);
    }

    return value;
  },
  z
    .number()
    .int("Dificuldade deve ser um número inteiro")
    .min(1, "Dificuldade deve estar entre 1 e 3")
    .max(3, "Dificuldade deve estar entre 1 e 3"),
);

const respostaCorretaSchema = z.union([
  z
    .string()
    .trim()
    .min(1, "Resposta correta não pode ser vazia")
    .max(500, "Resposta correta deve ter no máximo 500 caracteres"),
  z.null(),
]);

/**
 * Schema para criação de uma questão.
 *
 * enunciado, dificuldade, subjectId e authorId são obrigatórios.
 * respostaCorreta e ativa são opcionais.
 */
export const createQuestionSchema = z
  .object({
    enunciado: enunciadoSchema,
    dificuldade: dificuldadeSchema,
    respostaCorreta: respostaCorretaSchema.optional(),
    ativa: z.boolean().optional(),
    subjectId: idSchema,
    authorId: idSchema,
  })
  .strict();

/**
 * Schema para atualização parcial de uma questão.
 *
 * Pelo menos um campo deve ser enviado.
 */
export const updateQuestionSchema = z
  .object({
    enunciado: enunciadoSchema.optional(),
    dificuldade: dificuldadeSchema.optional(),
    respostaCorreta: respostaCorretaSchema.optional(),
    ativa: z.boolean().optional(),
    subjectId: idSchema.optional(),
    authorId: idSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Envie pelo menos um campo para atualização",
  });

/**
 * Schema para os parâmetros :id das rotas de questão.
 */
export const idParamSchema = z.object({
  id: idSchema,
});
