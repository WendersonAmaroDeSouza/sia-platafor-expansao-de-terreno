import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useOpportunityFlowViewModel } from "./useOpportunityFlowViewModel";
import { extractOpportunityDataUseCase } from "@/services/opportunities/useCases/extractOpportunityDataUseCase";
import { getUserContactUseCase } from "@/services/userPreferences/useCases/getUserContactUseCase";
import { saveUserContactUseCase } from "@/services/userPreferences/useCases/saveUserContactUseCase";
import { ExtractionResult } from "@/services/opportunities/models/Opportunity";

// Mock dependencies
vi.mock("@/services/opportunities/useCases/extractOpportunityDataUseCase");
vi.mock("@/services/userPreferences/useCases/getUserContactUseCase");
vi.mock("@/services/userPreferences/useCases/saveUserContactUseCase");

describe("useOpportunityFlowViewModel", () => {
  const mockSuccessResult: ExtractionResult = {
    type: "success",
    data: {
      cidade: "Florianópolis",
      estado: "SC",
      area_m2: 500,
      valor_total: 1000000,
      valor_por_m2: 2000,
      prioridade: "ALTA",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(getUserContactUseCase).mockResolvedValue({
      ok: true,
      data: null,
    });
    vi.mocked(saveUserContactUseCase).mockResolvedValue({
      ok: true,
      data: undefined,
    });
    // @ts-ignore
    vi.mocked(extractOpportunityDataUseCase).mockResolvedValue({
      ok: true,
      data: mockSuccessResult,
    });
  });

  it("should initialize with 'form' step", () => {
    const { result } = renderHook(() =>
      useOpportunityFlowViewModel({ open: true, onClose: vi.fn() }),
    );
    expect(result.current.step).toBe("form");
  });

  it("should load user contact on initialization", async () => {
    const mockContact = {
      name: "Saved User",
      email: "saved@email.com",
      lastUpdated: new Date(),
    };
    vi.mocked(getUserContactUseCase).mockResolvedValue({
      ok: true,
      data: mockContact,
    });

    const { result } = renderHook(() =>
      useOpportunityFlowViewModel({ open: true, onClose: vi.fn() }),
    );

    await waitFor(() => {
      expect(result.current.nome).toBe("Saved User");
      expect(result.current.email).toBe("saved@email.com");
    });

    expect(getUserContactUseCase).toHaveBeenCalled();
  });

  it("should handle form submission, save contact and transition to confirmation", async () => {
    const { result } = renderHook(() =>
      useOpportunityFlowViewModel({ open: true, onClose: vi.fn() }),
    );

    act(() => {
      result.current.setNome("Test User");
      result.current.setEmail("test@user.com");
      result.current.setDescricao("Test description");
    });

    await act(async () => {
      await result.current.handleSubmitForm({ preventDefault: vi.fn() } as any);
    });

    expect(saveUserContactUseCase).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@user.com",
    });

    expect(result.current.step).toBe("confirmation");
    expect(result.current.extracted).toEqual(mockSuccessResult.data);
  });

  it("should handle confirmation and transition to result", async () => {
    const { result } = renderHook(() =>
      useOpportunityFlowViewModel({ open: true, onClose: vi.fn() }),
    );

    // Fill form and submit to reach confirmation
    act(() => {
      result.current.setNome("Test");
      result.current.setEmail("test@test.com");
      result.current.setDescricao("Test description");
    });

    await act(async () => {
      await result.current.handleSubmitForm({ preventDefault: vi.fn() } as any);
    });

    expect(result.current.step).toBe("confirmation");

    // Confirm
    await act(async () => {
      await result.current.handleConfirm();
    });

    expect(result.current.step).toBe("result");
    expect(result.current.prioridade).toBe("ALTA");
    expect(result.current.resposta).toContain("Excelente oportunidade");
  });

  it("should handle clarification response", async () => {
    const mockClarificationResult: ExtractionResult = {
      type: "clarification",
      data: {
        campos_faltantes: ["area_m2"],
        perguntas: ["Qual a área?"],
      },
    };

    vi.mocked(extractOpportunityDataUseCase).mockResolvedValue({
      ok: true,
      data: mockClarificationResult,
    });

    const { result } = renderHook(() =>
      useOpportunityFlowViewModel({ open: true, onClose: vi.fn() }),
    );

    act(() => {
      result.current.setNome("Test");
      result.current.setEmail("test@test.com");
      result.current.setDescricao("Test description");
    });

    await act(async () => {
      await result.current.handleSubmitForm({ preventDefault: vi.fn() } as any);
    });

    expect(result.current.step).toBe("confirmation");
    expect(result.current.extracted).toBeNull();
    expect(result.current.clarification).toEqual(mockClarificationResult.data);
  });
});
