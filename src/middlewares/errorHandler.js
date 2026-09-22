import { AppError } from "../errors/AppError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export function notFoundHandler(req, _res, next) {
  next(
    new NotFoundError(`Rota ${req.method} ${req.originalUrl} não encontrada`),
  );
}

export default function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "JSON malformado",
      error: {
        code: "INVALID_JSON",
      },
      timestamp: new Date().toISOString(),
      path: req.path,
    });
  }

  if (error?.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Corpo da requisição excede o limite de 100 KB",
      error: {
        code: "PAYLOAD_TOO_LARGE",
      },
      timestamp: new Date().toISOString(),
      path: req.path,
    });
  }

  if (error instanceof AppError && error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: {
        code: error.code,
        ...(error.details && { details: error.details }),
      },
      timestamp: new Date().toISOString(),
      path: req.path,
    });
  }

  if (error?.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "Registro já existe",
      error: {
        code: "CONFLICT",
      },
      timestamp: new Date().toISOString(),
      path: req.path,
    });
  }

  console.error("Erro inesperado", {
    method: req.method,
    path: req.path,
    error,
  });

  return res.status(500).json({
    success: false,
    message: "Erro interno do servidor",
    error: {
      code: "INTERNAL_ERROR",
    },
    timestamp: new Date().toISOString(),
    path: req.path,
  });
}
