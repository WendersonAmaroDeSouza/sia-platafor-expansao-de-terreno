export interface N8NSuccessResponse {
  all_fields_clear: true;
  cidade: string;
  estado: string;
  area_m2: number;
  valor_total: number;
  valor_por_m2: number;
  prioridade: "ALTA" | "BAIXA";
}

export interface N8NClarificationResponse {
  all_fields_clear: false;
  unclear_fields: string[];
  question_for_user: string;
}

export type OpportunityResponseDTO =
  | N8NSuccessResponse
  | N8NClarificationResponse;
