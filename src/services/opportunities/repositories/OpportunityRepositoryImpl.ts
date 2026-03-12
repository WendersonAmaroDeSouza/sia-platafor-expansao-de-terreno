import { OpportunityRepository } from "./OpportunityRepository";
import { OpportunityGateway } from "../infrastructure/gateways/OpportunityGateway";
import { mapOpportunity } from "../infrastructure/mappers/OpportunityMapper";
import { ExtractionResult } from "../../models/Opportunity";

export class OpportunityRepositoryImpl implements OpportunityRepository {
  constructor(private gateway: OpportunityGateway) {}

  async extractData(text: string, email: string, nome: string): Promise<ExtractionResult> {
    const dto = await this.gateway.extractData(text, email, nome);
    return mapOpportunity(dto);
  }
}
