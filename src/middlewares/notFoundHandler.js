import { NotFoundError } from "../errors/NotFoundError.js";

export function notFoundHandler(req, _res, next) {
  next(
    new NotFoundError(`Rota ${req.method} ${req.originalUrl} não encontrada`),
  );
}
