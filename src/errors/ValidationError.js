import { AppError } from "./AppError.js";

export class ValidationError extends AppError {
  constructor(message = "Dados inválidos", details = []) {
    super(message, 400, "VALIDATION_ERROR", details);

    this.name = "ValidationError";
  }
}
