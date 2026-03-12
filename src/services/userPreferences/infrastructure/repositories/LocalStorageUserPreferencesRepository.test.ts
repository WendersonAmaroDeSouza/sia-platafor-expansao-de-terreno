import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { LocalStorageUserPreferencesRepository } from "./LocalStorageUserPreferencesRepository";

describe("LocalStorageUserPreferencesRepository", () => {
  let repository: LocalStorageUserPreferencesRepository;
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};

    const localStorageMock = {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      key: vi.fn(),
      length: 0,
    };

    vi.stubGlobal("localStorage", localStorageMock);

    repository = new LocalStorageUserPreferencesRepository();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should save contact to localStorage", async () => {
    const contact = {
      name: "John Doe",
      email: "john@example.com",
      lastUpdated: new Date(),
    };

    await repository.saveContact(contact);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "user_contact_preferences",
      expect.stringContaining("John Doe"),
    );
  });

  it("should retrieve contact from localStorage", async () => {
    const contact = {
      name: "Jane Doe",
      email: "jane@example.com",
      lastUpdated: new Date(),
    };

    localStorage.setItem("user_contact_preferences", JSON.stringify(contact));

    const result = await repository.getContact();

    expect(result).not.toBeNull();
    expect(result?.name).toBe(contact.name);
    expect(result?.email).toBe(contact.email);
    expect(result?.lastUpdated).toBeInstanceOf(Date);
    expect(result?.lastUpdated.toISOString()).toBe(
      contact.lastUpdated.toISOString(),
    );
  });

  it("should return null if no contact is stored", async () => {
    const result = await repository.getContact();
    expect(result).toBeNull();
  });

  it("should return null if stored data is corrupted/invalid JSON", async () => {
    vi.mocked(localStorage.getItem).mockReturnValue("invalid-json");

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await repository.getContact();

    expect(result).toBeNull();
    consoleSpy.mockRestore();
  });
});
