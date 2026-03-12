import { UserContact } from "../../../models/UserContact";
import { UserPreferencesRepository } from "../../../repositories/UserPreferencesRepository";

const STORAGE_KEY = "user_contact_preferences";

export class LocalStorageUserPreferencesRepository implements UserPreferencesRepository {
  async saveContact(contact: UserContact): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contact));
    } catch (error) {
      console.error("Failed to save user contact to localStorage", error);
      // Em caso de erro no localStorage (ex: quota exceeded), podemos optar por não falhar a operação
      // ou lançar um erro customizado. Para este caso, vamos logar e seguir.
    }
  }

  async getContact(): Promise<UserContact | null> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;

      const parsed = JSON.parse(data);

      // Validação básica para garantir que o dado não está corrompido
      if (typeof parsed.name !== "string" || typeof parsed.email !== "string") {
        return null;
      }

      return {
        ...parsed,
        lastUpdated: new Date(parsed.lastUpdated), // Rehidratar a data
      };
    } catch (error) {
      console.error("Failed to retrieve user contact from localStorage", error);
      return null;
    }
  }
}
