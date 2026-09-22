import { AppError } from "./AppError.js";

export class ConflictError extends AppError {
  constructor(message = "Conflito", details = []) {
    super(message, 409, "CONFLICT", details);

    this.name = "ConflictError";
  }
}
