import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { extractOpportunityDataUseCase } from "./extractOpportunityDataUseCase";
import { OpportunityResponseDTO } from "../infrastructure/dto/OpportunityDTO";

describe("extractOpportunityDataUseCase", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    mockFetch.mockReset();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  const mockResponse = (data: OpportunityResponseDTO) => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => data,
    } as Response);
  };

  it("should extract complete information correctly via external service (Success)", async () => {
    const text = "Tenho um terreno em Florianópolis com 500m2 por 2 milhões";
    const email = "test@example.com";
    const nome = "Test User";

    const expectedData: OpportunityResponseDTO = {
      all_fields_clear: true,
      cidade: "Florianópolis",
      estado: "SC",
      area_m2: 500,
      valor_total: 2000000,
      valor_por_m2: 4000,
      prioridade: "ALTA",
    };

    mockResponse(expectedData);

    const result = await extractOpportunityDataUseCase(text, email, nome);

    expect(result.ok).toBe(true);
    if (result.ok && result.data.type === "success") {
      expect(result.data.data.cidade).toBe("Florianópolis");
      expect(result.data.data.area_m2).toBe(500);
      expect(result.data.data.prioridade).toBe("ALTA");
    } else {
      expect.fail("Result should be success");
    }
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should identify missing fields via external service (Clarification)", async () => {
    const text = "Tenho um terreno em Florianópolis";
    const email = "test@example.com";
    const nome = "Test User";

    const expectedData: OpportunityResponseDTO = {
      all_fields_clear: false,
      unclear_fields: ["area_m2", "valor_total"],
      question_for_user: "Qual a área e o valor?",
    };

    mockResponse(expectedData);

    const result = await extractOpportunityDataUseCase(text, email, nome);

    expect(result.ok).toBe(true);
    if (result.ok && result.data.type === "clarification") {
      expect(result.data.data.campos_faltantes).toContain("area_m2");
      expect(result.data.data.perguntas).toContain("Qual a área e o valor?");
    } else {
      expect.fail("Result should be clarification");
    }
  });

  it("should handle service timeout", async () => {
    mockFetch.mockImplementation(async () => {
      const error = new Error("The user aborted a request.");
      error.name = "AbortError";
      throw error;
    });

    const promise = extractOpportunityDataUseCase("text", "email", "nome");

    await vi.advanceTimersByTimeAsync(20000);

    const result = await promise;

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toMatch(/unavailable/i);
    }
  });

  it("should handle invalid schema response", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ invalid: "schema" }),
    } as Response);

    const result = await extractOpportunityDataUseCase("text", "email", "nome");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toMatch(/Invalid response format/i);
    }
  });
});
