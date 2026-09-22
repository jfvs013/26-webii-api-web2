import * as userService from "../services/userService.js";

/**
 * Cria um usuário.
 * A validação dos dados é realizada pelo middleware Zod antes deste controller.
 */
export const create = async (req, res, next) => {
  try {
    const usuario = await userService.createUser(req.body);

    return res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso",
      data: usuario,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Lista todos os usuários.
 */
export const getAll = async (_req, res, next) => {
  try {
    const usuarios = await userService.getAllUsers();

    return res.status(200).json({
      success: true,
      data: usuarios,
      total: usuarios.length,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Busca um usuário pelo ID.
 * O parâmetro :id já foi validado pelo middleware Zod.
 */
export const getById = async (req, res, next) => {
  try {
    const usuario = await userService.getUserById(req.params.id);

    return res.status(200).json({
      success: true,
      data: usuario,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Atualiza um usuário.
 * Os parâmetros e o corpo já foram validados pelo middleware Zod.
 */
export const update = async (req, res, next) => {
  try {
    const usuario = await userService.updateUser(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Usuário atualizado com sucesso",
      data: usuario,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Remove um usuário.
 * O parâmetro :id já foi validado pelo middleware Zod.
 */
export const remove = async (req, res, next) => {
  try {
    const usuario = await userService.deleteUser(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Usuário removido com sucesso",
      data: usuario,
    });
  } catch (error) {
    return next(error);
  }
};
