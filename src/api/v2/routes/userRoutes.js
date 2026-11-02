import express from "express";
import uploadPhoto from "../../../config/multer.js";
import * as userController from "../controllers/userController.js";
import validate from "../../../middlewares/validate.js";
import {
  createUserV2Schema,
  idParamSchema,
  updateUserV2Schema,
  updateUserV2WithFileSchema,
} from "../schemas/userSchema.js";

const router = express.Router();

/**
 * Valida o corpo do PATCH depois do Multer: com arquivo, a foto já é uma
 * atualização válida; sem arquivo, ao menos um campo textual é obrigatório.
 */
function validateUpdateBody(req, res, next) {
  const schema = req.file ? updateUserV2WithFileSchema : updateUserV2Schema;
  return validate(schema)(req, res, next);
}

router.post(
  "/",
  uploadPhoto,
  validate(createUserV2Schema),
  userController.create,
);
router.get("/", userController.getAll);
router.get("/:id", validate(idParamSchema, "params"), userController.getById);
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  uploadPhoto,
  validateUpdateBody,
  userController.update,
);
router.delete("/:id", validate(idParamSchema, "params"), userController.remove);

export default router;
