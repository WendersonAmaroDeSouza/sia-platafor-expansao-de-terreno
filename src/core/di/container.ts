import { LocalStorageUserPreferencesRepository } from "@/services/userPreferences/infrastructure/repositories/LocalStorageUserPreferencesRepository";
import { UserPreferencesRepository } from "@/services/userPreferences/repositories/UserPreferencesRepository";
import { OpportunityRepository } from "@/services/opportunities/repositories/OpportunityRepository";
import { OpportunityRepositoryImpl } from "@/services/opportunities/repositories/OpportunityRepositoryImpl";
import { OpportunityGateway } from "@/services/opportunities/infrastructure/gateways/OpportunityGateway";

interface Container {
  userPreferencesRepository: UserPreferencesRepository;
  opportunityRepository: OpportunityRepository;
}

const opportunityServiceUrl = import.meta.env.VITE_OPPORTUNITY_SERVICE_URL;

export const container: Container = {
  userPreferencesRepository: new LocalStorageUserPreferencesRepository(),
  opportunityRepository: new OpportunityRepositoryImpl(
    new OpportunityGateway(opportunityServiceUrl),
  ),
};
