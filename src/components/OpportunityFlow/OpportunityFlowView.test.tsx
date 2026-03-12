import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { OpportunityFlowView } from "./OpportunityFlowView";
import { FlowStep } from "./useOpportunityFlowViewModel";

describe("OpportunityFlowView", () => {
  const defaultProps = {
    open: true,
    step: "confirmation" as FlowStep,
    nome: "Test User",
    setNome: vi.fn(),
    email: "test@email.com",
    setEmail: vi.fn(),
    descricao: "Terreno em algum lugar",
    setDescricao: vi.fn(),
    extracted: null,
    clarification: null,
    prioridade: "BAIXA" as const,
    resposta: "",
    handleSubmitForm: vi.fn(),
    handleReprocess: vi.fn(),
    handleConfirm: vi.fn(),
    handleClose: vi.fn(),
    resetFlow: vi.fn(),
  };

  it("should display clarification question when fields are unclear", () => {
    const clarificationProps = {
      ...defaultProps,
      clarification: {
        campos_faltantes: ["cidade"],
        perguntas: ["Qual a cidade do terreno?"],
      },
    };

    render(<OpportunityFlowView {...clarificationProps} />);

    expect(screen.getByText(/Campos não identificados:/i)).toBeInTheDocument();
    expect(screen.getByText("cidade")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Ajuste a descrição do terreno de forma que responda a seguinte questão:/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Qual a cidade do terreno?")).toBeInTheDocument();
  });

  it("should not display question if clarification is null", () => {
    render(<OpportunityFlowView {...defaultProps} />);

    expect(screen.queryByText(/Ajuste a descrição/i)).not.toBeInTheDocument();
  });
});
