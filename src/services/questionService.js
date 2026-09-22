import prisma from "../config/database.js";
import { NotFoundError } from "../errors/NotFoundError.js";

const publicUserSelect = {
  id: true,
  nome: true,
  email: true,
  papel: true,
  foto: true,
};

const publicSubjectSelect = {
  id: true,
  nome: true,
  ativa: true,
};

const publicQuestionSelect = {
  id: true,
  enunciado: true,
  dificuldade: true,
  respostaCorreta: true,
  ativa: true,
  createdAt: true,
  updatedAt: true,
  subject: { select: publicSubjectSelect },
  author: { select: publicUserSelect },
};

/**
 * Verifica se os registros relacionados existem.
 *
 * @param {Object} relations - IDs dos registros relacionados.
 * @param {number} [relations.subjectId] - ID da matéria.
 * @param {number} [relations.authorId] - ID do autor.
 * @throws {NotFoundError} Quando a matéria ou o autor não existe.
 */
async function validateRelations({ subjectId, authorId }) {
  if (subjectId !== undefined) {
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      select: { id: true },
    });

    if (!subject) {
      throw new NotFoundError(`Matéria com ID ${subjectId} não encontrada`);
    }
  }

  if (authorId !== undefined) {
    const author = await prisma.user.findUnique({
      where: { id: authorId },
      select: { id: true },
    });

    if (!author) {
      throw new NotFoundError(`Usuário com ID ${authorId} não encontrado`);
    }
  }
}

/**
 * Lista todas as questões.
 *
 * @returns {Promise<Array>} Lista de questões.
 */
export const getAllQuestions = async () => {
  return prisma.question.findMany({
    select: publicQuestionSelect,
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Busca uma questão pelo ID.
 *
 * @param {number} questionId - ID da questão.
 * @returns {Promise<Object>} Questão encontrada.
 * @throws {NotFoundError} Quando a questão não existe.
 */
export const getQuestionById = async (questionId) => {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: publicQuestionSelect,
  });

  if (!question) {
    throw new NotFoundError(`Questão com ID ${questionId} não encontrada`);
  }

  return question;
};

/**
 * Cria uma nova questão.
 *
 * @param {Object} questionData - Dados da questão.
 * @returns {Promise<Object>} Questão criada.
 * @throws {NotFoundError} Quando a matéria ou o autor não existe.
 */
export const createQuestion = async (questionData) => {
  await validateRelations(questionData);

  return prisma.question.create({
    data: {
      enunciado: questionData.enunciado.trim(),
      dificuldade: questionData.dificuldade,
      respostaCorreta: questionData.respostaCorreta?.trim() || null,
      subjectId: questionData.subjectId,
      authorId: questionData.authorId,
      ativa: questionData.ativa ?? true,
    },
    select: publicQuestionSelect,
  });
};

/**
 * Atualiza uma questão existente.
 *
 * @param {number} questionId - ID da questão.
 * @param {Object} questionData - Dados para atualização.
 * @returns {Promise<Object>} Questão atualizada.
 * @throws {NotFoundError} Quando a questão, matéria ou autor não existe.
 */
export const updateQuestion = async (questionId, questionData) => {
  const questionExists = await prisma.question.findUnique({
    where: { id: questionId },
    select: { id: true },
  });

  if (!questionExists) {
    throw new NotFoundError(`Questão com ID ${questionId} não encontrada`);
  }

  await validateRelations(questionData);

  const data = {};

  if (Object.hasOwn(questionData, "enunciado")) {
    data.enunciado = questionData.enunciado.trim();
  }

  if (Object.hasOwn(questionData, "dificuldade")) {
    data.dificuldade = questionData.dificuldade;
  }

  if (Object.hasOwn(questionData, "respostaCorreta")) {
    data.respostaCorreta = questionData.respostaCorreta?.trim() || null;
  }

  if (Object.hasOwn(questionData, "subjectId")) {
    data.subjectId = questionData.subjectId;
  }

  if (Object.hasOwn(questionData, "authorId")) {
    data.authorId = questionData.authorId;
  }

  if (Object.hasOwn(questionData, "ativa")) {
    data.ativa = questionData.ativa;
  }

  return prisma.question.update({
    where: { id: questionId },
    data,
    select: publicQuestionSelect,
  });
};

/**
 * Remove uma questão.
 *
 * @param {number} questionId - ID da questão.
 * @returns {Promise<Object>} Questão removida.
 * @throws {NotFoundError} Quando a questão não existe.
 */
export const deleteQuestion = async (questionId) => {
  const questionExists = await prisma.question.findUnique({
    where: { id: questionId },
    select: { id: true },
  });

  if (!questionExists) {
    throw new NotFoundError(`Questão com ID ${questionId} não encontrada`);
  }

  try {
    return await prisma.question.delete({
      where: { id: questionId },
      select: publicQuestionSelect,
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new NotFoundError(`Questão com ID ${questionId} não encontrada`);
    }

    throw error;
  }
};
