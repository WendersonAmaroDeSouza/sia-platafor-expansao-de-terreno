import { Result } from "@/core/types";
import { ExtractionResult } from "../models/Opportunity";
import { container } from "@/core/di/container";

export async function extractOpportunityDataUseCase(
  text: string,
  email: string,
  nome: string,
): Promise<Result<ExtractionResult>> {
  try {
    const extracted = await container.opportunityRepository.extractData(
      text,
      email,
      nome,
    );
    return { ok: true, data: extracted };
  } catch (error) {
    console.error("[extractOpportunityDataUseCase] Error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}
