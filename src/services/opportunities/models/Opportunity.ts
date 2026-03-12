export type Priority = "ALTA" | "BAIXA";

export interface OpportunityData {
  cidade: string;
  estado: string;
  area_m2: number;
  valor_total: number;
  valor_por_m2: number;
  prioridade: Priority;
}

export interface ClarificationData {
  campos_faltantes: string[];
  perguntas: string[];
}

export type ExtractionResult =
  | { type: "success"; data: OpportunityData }
  | { type: "clarification"; data: ClarificationData };
