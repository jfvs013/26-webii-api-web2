import { z } from "zod";
import { idSchema } from "./idSchema.js";

const nomeSchema = z
  .string()
  .trim()
  .min(3, "Nome deve ter pelo menos 3 caracteres")
  .max(100, "Nome deve ter no máximo 100 caracteres");

const professorIdSchema = idSchema;

/**
 * Schema para criação de uma matéria.
 * nome e professorId são obrigatórios.
 * ativa é opcional e preserva false quando informado.
 */
export const createSubjectSchema = z
  .object({
    nome: nomeSchema,
    professorId: professorIdSchema,
    ativa: z.boolean().optional(),
  })
  .strict();

/**
 * Schema para atualização parcial de uma matéria.
 * Pelo menos um campo deve ser enviado.
 */
export const updateSubjectSchema = z
  .object({
    nome: nomeSchema.optional(),
    professorId: professorIdSchema.optional(),
    ativa: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Envie pelo menos um campo para atualização",
  });

/**
 * Schema para os parâmetros :id das rotas de matéria.
 */
export const idParamSchema = z.object({
  id: idSchema,
});
