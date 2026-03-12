import { describe, it, expect, vi, beforeEach } from "vitest";
import { saveUserContactUseCase } from "./saveUserContactUseCase";

const mocks = vi.hoisted(() => {
  return {
    saveContact: vi.fn(),
    getContact: vi.fn(),
  };
});

vi.mock("@/core/di/container", () => ({
  container: {
    userPreferencesRepository: mocks,
  },
}));

describe("saveUserContactUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should save user contact successfully when valid data is provided", async () => {
    const contact = { name: "John Doe", email: "john@example.com" };

    const result = await saveUserContactUseCase(contact);

    expect(result.ok).toBe(true);
    expect(mocks.saveContact).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "John Doe",
        email: "john@example.com",
        lastUpdated: expect.any(Date),
      }),
    );
  });

  it("should return error when name is empty", async () => {
    const contact = { name: "", email: "john@example.com" };

    const result = await saveUserContactUseCase(contact);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("Nome é obrigatório");
    }
    expect(mocks.saveContact).not.toHaveBeenCalled();
  });

  it("should return error when email is empty", async () => {
    const contact = { name: "John Doe", email: "" };

    const result = await saveUserContactUseCase(contact);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("E-mail é obrigatório");
    }
    expect(mocks.saveContact).not.toHaveBeenCalled();
  });

  it("should return error when email is invalid", async () => {
    const contact = { name: "John Doe", email: "invalid-email" };

    const result = await saveUserContactUseCase(contact);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("E-mail inválido");
    }
    expect(mocks.saveContact).not.toHaveBeenCalled();
  });

  it("should handle repository errors gracefully", async () => {
    const contact = { name: "John Doe", email: "john@example.com" };
    mocks.saveContact.mockRejectedValueOnce(new Error("Storage error"));

    const result = await saveUserContactUseCase(contact);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toBe("Storage error");
    }
  });
});
