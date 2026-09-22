import prisma from "../config/database.js";
import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

const publicUserSelect = {
  id: true,
  nome: true,
  email: true,
  papel: true,
  foto: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * Normaliza um e-mail para que comparações e persistência usem o mesmo formato.
 * @param {string} email - E-mail informado na requisição.
 * @returns {string} E-mail sem espaços nas extremidades e em letras minúsculas.
 */
const normalizeEmail = (email) => email.trim().toLowerCase();

/**
 * Busca todos os usuários no formato público, do mais recente para o mais antigo.
 * @returns {Promise<Object[]>} Lista de usuários sem campos internos.
 */
export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: publicUserSelect,
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Busca um usuário pelo identificador único.
 * @param {number} userId - ID do usuário.
 * @returns {Promise<Object>} Usuário encontrado.
 * @throws {NotFoundError} Quando o usuário não existe.
 */
export const getUserById = async (userId) => {
  const usuario = await prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelect,
  });

  if (!usuario) {
    throw new NotFoundError(`Usuário com ID ${userId} não encontrado`);
  }

  return usuario;
};

/**
 * Cria um usuário depois de normalizar o e-mail e verificar a sua unicidade.
 * @param {{ nome: string, email: string, papel?: string, foto?: string|null }} userData
 * @returns {Promise<Object>} Usuário criado.
 * @throws {ConflictError} Quando o e-mail já está cadastrado.
 */
export const createUser = async (userData) => {
  const email = normalizeEmail(userData.email);

  const emailOwner = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (emailOwner) {
    throw new ConflictError("Email já cadastrado no sistema");
  }

  try {
    return await prisma.user.create({
      data: {
        nome: userData.nome.trim(),
        email,
        papel: userData.papel ?? "PROFESSOR",
        foto: userData.foto?.trim() || null,
      },
      select: publicUserSelect,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new ConflictError("Email já cadastrado no sistema");
    }

    throw error;
  }
};

/**
 * Atualiza somente os campos enviados para um usuário existente.
 * @param {number} userId - ID do usuário a atualizar.
 * @param {{ nome?: string, email?: string, papel?: string, foto?: string|null }} userData
 * @returns {Promise<Object>} Usuário atualizado.
 * @throws {NotFoundError} Quando o usuário não existe.
 * @throws {ConflictError} Quando o novo e-mail já pertence a outro usuário.
 */
export const updateUser = async (userId, userData) => {
  const usuarioExistente = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  if (!usuarioExistente) {
    throw new NotFoundError(`Usuário com ID ${userId} não encontrado`);
  }

  const data = {};

  if (Object.hasOwn(userData, "nome")) {
    data.nome = userData.nome.trim();
  }

  if (Object.hasOwn(userData, "email")) {
    const email = normalizeEmail(userData.email);

    const emailOwner = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (emailOwner && emailOwner.id !== userId) {
      throw new ConflictError("Email já cadastrado no sistema");
    }

    data.email = email;
  }

  if (Object.hasOwn(userData, "papel")) {
    data.papel = userData.papel;
  }

  if (Object.hasOwn(userData, "foto")) {
    data.foto = userData.foto?.trim() || null;
  }

  try {
    return await prisma.user.update({
      where: { id: userId },
      data,
      select: publicUserSelect,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new ConflictError("Email já cadastrado no sistema");
    }

    throw error;
  }
};

/**
 * Remove um usuário que não possua matérias nem questões vinculadas.
 * @param {number} userId - ID do usuário a remover.
 * @returns {Promise<Object>} Usuário removido.
 * @throws {NotFoundError} Quando o usuário não existe.
 * @throws {ConflictError} Quando o usuário possui matérias ou questões vinculadas.
 */
export const deleteUser = async (userId) => {
  const usuarioExistente = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      ...publicUserSelect,
      _count: {
        select: {
          subjects: true,
          questions: true,
        },
      },
    },
  });

  if (!usuarioExistente) {
    throw new NotFoundError(`Usuário com ID ${userId} não encontrado`);
  }

  if (
    usuarioExistente._count.subjects > 0 ||
    usuarioExistente._count.questions > 0
  ) {
    throw new ConflictError("Usuário possui matérias ou questões vinculadas");
  }

  try {
    return await prisma.user.delete({
      where: { id: userId },
      select: publicUserSelect,
    });
  } catch (error) {
    if (error.code === "P2003" || error.code === "P2014") {
      throw new ConflictError("Usuário possui matérias ou questões vinculadas");
    }

    throw error;
  }
};
