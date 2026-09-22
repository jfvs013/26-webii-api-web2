import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../src/app.js";

describe("Middlewares de validação e tratamento de erros", () => {
  it("retorna 404 para rota inexistente", async () => {
    const response = await request(app).get("/rota-que-nao-existe");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });

  it("retorna 400 para JSON malformado", async () => {
    const response = await request(app)
      .post("/users")
      .set("Content-Type", "application/json")
      .send('{"nome": "Teste",');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("INVALID_JSON");
  });

  it("retorna 413 para payload maior que 100 KB", async () => {
    const largePayload = {
      nome: "A".repeat(101 * 1024),
      email: "teste@example.com",
    };

    const response = await request(app).post("/users").send(largePayload);

    expect(response.status).toBe(413);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("PAYLOAD_TOO_LARGE");
  });

  it("retorna 400 quando o ID é inválido", async () => {
    const response = await request(app).get("/users/abc");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("retorna 400 quando o corpo contém dados inválidos", async () => {
    const response = await request(app).post("/users").send({
      nome: "Jo",
      email: "email-invalido",
      campoExtra: "não permitido",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});
