import { OpportunityResponseDTO } from "../dto/OpportunityDTO";
import { HttpClient } from "../../../../core/http/httpClient";

export class OpportunityGateway {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async extractData(
    text: string,
    email: string,
    nome: string,
  ): Promise<OpportunityResponseDTO> {
    try {
      console.log("[OpportunityGateway] Extracting data via N8N", {
        email,
        textLength: text.length,
      });

      const response = await HttpClient.post<any>(
        this.baseUrl,
        { text, email, nome },
        {
          timeout: 100000,
          retries: 3,
          backoff: 1000,
        },
      );

      const normalizedResponse = this.normalizeResponse(response);

      if (!this.isValidResponse(normalizedResponse)) {
        console.error(
          "[OpportunityGateway] Invalid response schema:",
          JSON.stringify(response),
        );
        throw new Error("Invalid response format from opportunity service");
      }

      return normalizedResponse;
    } catch (error: any) {
      console.error("[OpportunityGateway] Error extracting data:", error);

      if (
        error.message.includes("timeout") ||
        error.message.includes("Server error")
      ) {
        throw new Error(
          "Service unavailable. Please try manual entry or try again later.",
        );
      }

      throw error;
    }
  }

  private normalizeResponse(response: any): any {
    if (!response || typeof response !== "object") {
      return response;
    }

    if (
      "data" in response &&
      typeof response.data === "object" &&
      response.data !== null
    ) {
      return this.normalizeResponse(response.data);
    }

    if (!("all_fields_clear" in response)) {
      const hasSuccessFields =
        "cidade" in response &&
        ("valor_total" in response || "area_m2" in response);

      if (hasSuccessFields) {
        return {
          ...response,
          all_fields_clear: true,
        };
      }
    }

    return response;
  }

  private isValidResponse(data: any): data is OpportunityResponseDTO {
    if (!data || typeof data !== "object") return false;

    if ("all_fields_clear" in data) {
      if (data.all_fields_clear === true) {
        return (
          typeof data.cidade === "string" &&
          typeof data.estado === "string" &&
          typeof data.area_m2 === "number" &&
          typeof data.valor_total === "number" &&
          typeof data.valor_por_m2 === "number" &&
          typeof data.prioridade === "string"
        );
      } else if (data.all_fields_clear === false) {
        return (
          Array.isArray(data.unclear_fields) &&
          typeof data.question_for_user === "string"
        );
      }
    }

    return false;
  }
}
