import {
  ExtractionResult,
  OpportunityData,
  ClarificationData,
} from "../../models/Opportunity";
import { OpportunityResponseDTO } from "../dto/OpportunityDTO";

export function mapOpportunity(dto: OpportunityResponseDTO): ExtractionResult {
  if (dto.all_fields_clear === true) {
    const data: OpportunityData = {
      cidade: dto.cidade,
      estado: dto.estado,
      area_m2: dto.area_m2,
      valor_total: dto.valor_total,
      valor_por_m2: dto.valor_por_m2,
      prioridade: dto.prioridade,
    };
    return { type: "success", data };
  } else {
    const data: ClarificationData = {
      campos_faltantes: dto.unclear_fields,
      perguntas: [dto.question_for_user],
    };
    return { type: "clarification", data };
  }
}
