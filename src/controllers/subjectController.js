import * as subjectService from "../services/subjectService.js";

/**
 * Cria uma matéria.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const create = async (req, res, next) => {
  try {
    const subject = await subjectService.createSubject(req.body);

    return res.status(201).json({
      success: true,
      message: "Matéria criada com sucesso",
      data: subject,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Lista todas as matérias.
 *
 * @param {import("express").Request} _req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const getAll = async (_req, res, next) => {
  try {
    const subjects = await subjectService.getAllSubjects();

    return res.status(200).json({
      success: true,
      data: subjects,
      total: subjects.length,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Busca uma matéria pelo ID.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const getById = async (req, res, next) => {
  try {
    const subject = await subjectService.getSubjectById(req.params.id);

    return res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Atualiza uma matéria.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const update = async (req, res, next) => {
  try {
    const subject = await subjectService.updateSubject(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Matéria atualizada com sucesso",
      data: subject,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Remove uma matéria.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const remove = async (req, res, next) => {
  try {
    const subject = await subjectService.deleteSubject(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Matéria removida com sucesso",
      data: subject,
    });
  } catch (error) {
    return next(error);
  }
};
