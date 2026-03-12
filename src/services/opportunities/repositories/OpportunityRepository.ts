import { ExtractionResult } from "../../models/Opportunity";

export interface OpportunityRepository {
  extractData(
    text: string,
    email: string,
    nome: string,
  ): Promise<ExtractionResult>;
}
