import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { OpportunityGateway } from "./OpportunityGateway";
import { HttpClient } from "../../../../core/http/httpClient";

describe("OpportunityGateway", () => {
  let gateway: OpportunityGateway;
  const mockPost = vi.fn();

  beforeEach(() => {
    vi.spyOn(HttpClient, "post").mockImplementation(mockPost);
    gateway = new OpportunityGateway("http://test-url.com");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should handle direct success response format", async () => {
    const directResponse = {
      cidade: "CAMPO GRANDE",
      estado: "MS",
      area_m2: 200,
      valor_total: 250000,
      valor_por_m2: 1250,
      prioridade: "BAIXA",
    };

    mockPost.mockResolvedValue(directResponse);

    const result = await gateway.extractData("text", "email", "name");

    expect(result).toEqual({
      ...directResponse,
      all_fields_clear: true,
    });
  });

  it("should handle wrapped data response format", async () => {
    const wrappedResponse = {
      data: {
        all_fields_clear: true,
        cidade: "CAMPO GRANDE",
        estado: "MS",
        area_m2: 200,
        valor_total: 250000,
        valor_por_m2: 1250,
        prioridade: "BAIXA",
      },
    };

    mockPost.mockResolvedValue(wrappedResponse);

    const result = await gateway.extractData("text", "email", "name");

    expect(result).toEqual(wrappedResponse.data);
  });

  it("should handle wrapped data response format without all_fields_clear", async () => {
    const wrappedResponse = {
      data: {
        cidade: "CAMPO GRANDE",
        estado: "MS",
        area_m2: 200,
        valor_total: 250000,
        valor_por_m2: 1250,
        prioridade: "BAIXA",
      },
    };

    mockPost.mockResolvedValue(wrappedResponse);

    const result = await gateway.extractData("text", "email", "name");

    expect(result).toEqual({
      ...wrappedResponse.data,
      all_fields_clear: true,
    });
  });

  it("should handle clarification response format correctly", async () => {
    const clarificationResponse = {
      all_fields_clear: false,
      unclear_fields: ["area_m2"],
      question_for_user: "Qual a área?",
    };

    mockPost.mockResolvedValue(clarificationResponse);

    const result = await gateway.extractData("text", "email", "name");
    expect(result).toEqual(clarificationResponse);
  });

  it("should handle service unavailable error", async () => {
    mockPost.mockRejectedValue(new Error("Server error"));

    await expect(gateway.extractData("text", "email", "name")).rejects.toThrow(
      "Service unavailable. Please try manual entry or try again later.",
    );
  });

  it("should throw error for invalid response format (empty object)", async () => {
    mockPost.mockResolvedValue({});

    await expect(gateway.extractData("text", "email", "name")).rejects.toThrow(
      "Invalid response format from opportunity service",
    );
  });

  it("should throw error for invalid response format (missing required fields)", async () => {
    const invalidResponse = {
      cidade: "CAMPO GRANDE",
      // Missing other fields
    };

    mockPost.mockResolvedValue(invalidResponse);

    await expect(gateway.extractData("text", "email", "name")).rejects.toThrow(
      "Invalid response format from opportunity service",
    );
  });
});
