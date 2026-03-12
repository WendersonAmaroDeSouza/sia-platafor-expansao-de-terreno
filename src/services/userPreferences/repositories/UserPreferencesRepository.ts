import { UserContact } from "../models/UserContact";

export interface UserPreferencesRepository {
  saveContact(contact: UserContact): Promise<void>;
  getContact(): Promise<UserContact | null>;
}
