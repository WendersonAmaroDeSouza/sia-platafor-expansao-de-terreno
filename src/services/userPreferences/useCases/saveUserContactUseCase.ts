import { container } from "@/core/di/container";
import { UserContact } from "../models/UserContact";

export type SaveContactInput = Omit<UserContact, "lastUpdated">;

type Result<T> = { ok: true; data: T } | { ok: false; error: Error };

export async function saveUserContactUseCase(
  input: SaveContactInput,
): Promise<Result<void>> {
  try {
    if (!input.name || input.name.trim() === "") {
      return { ok: false, error: new Error("Nome é obrigatório") };
    }

    if (!input.email || input.email.trim() === "") {
      return { ok: false, error: new Error("E-mail é obrigatório") };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      return { ok: false, error: new Error("E-mail inválido") };
    }

    const contact: UserContact = {
      name: input.name.trim(),
      email: input.email.trim(),
      lastUpdated: new Date(),
    };

    await container.userPreferencesRepository.saveContact(contact);

    return { ok: true, data: undefined };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}
