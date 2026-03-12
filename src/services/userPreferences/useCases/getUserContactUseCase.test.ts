import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserContactUseCase } from "./getUserContactUseCase";

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

describe("getUserContactUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return contact when repository has data", async () => {
    const mockData = {
      name: "John Doe",
      email: "john@example.com",
      lastUpdated: new Date(),
    };
    mocks.getContact.mockResolvedValue(mockData);

    const result = await getUserContactUseCase();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual(mockData);
    }
  });

  it("should return null data when repository is empty", async () => {
    mocks.getContact.mockResolvedValue(null);

    const result = await getUserContactUseCase();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toBeNull();
    }
  });

  it("should handle repository errors", async () => {
    mocks.getContact.mockRejectedValue(new Error("Read error"));

    const result = await getUserContactUseCase();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toBe("Read error");
    }
  });
});
