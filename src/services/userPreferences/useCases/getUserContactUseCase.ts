import { container } from "@/core/di/container";
import { UserContact } from "../models/UserContact";

type Result<T> = { ok: true; data: T } | { ok: false; error: Error };

export async function getUserContactUseCase(): Promise<
  Result<UserContact | null>
> {
  try {
    const contact = await container.userPreferencesRepository.getContact();
    return { ok: true, data: contact };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}
