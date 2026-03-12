import {
  X,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Edit3,
} from "lucide-react";
import { formatCurrency } from "@/formatters/formatCurrency";
import { useOpportunityFlowViewModel } from "./useOpportunityFlowViewModel";

type Props = Readonly<ReturnType<typeof useOpportunityFlowViewModel>>;

export function OpportunityFlowView({
  open,
  step,
  nome,
  setNome,
  email,
  setEmail,
  descricao,
  setDescricao,
  extracted,
  clarification,
  prioridade,
  resposta,
  handleSubmitForm,
  handleReprocess,
  handleConfirm,
  handleClose,
  resetFlow,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
      <div className="card-elevated w-full max-w-lg max-h-[90vh] overflow-y-auto relative animate-float-in">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP: Form */}
        {step === "form" && (
          <form onSubmit={handleSubmitForm} className="space-y-5">
            <div>
              <h2 className="text-2xl font-extrabold text-primary">
                Enviar oportunidade
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Descreva o terreno e a Sia fará a análise automaticamente.
              </p>
            </div>

            <div>
              <label className="form-label">Nome*</label>
              <input
                className="form-input"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">E-mail*</label>
              <input
                type="email"
                className="form-input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Descrição do terreno*</label>
              <textarea
                className="form-input min-h-[120px] resize-y"
                placeholder='Ex: "Tenho um terreno de 500m² em Florianópolis frente mar por 2 milhões"'
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-success w-full">
              <Send className="w-4 h-4 mr-2" />
              Enviar para análise
            </button>
          </form>
        )}

        {/* STEP: Processing */}
        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6 animate-pulse-glow">
              <Loader2 className="w-8 h-8 text-secondary animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              Sia está analisando seu terreno...
            </h3>
            <p className="text-muted-foreground text-sm">
              Extraindo informações da sua descrição
            </p>
          </div>
        )}

        {/* STEP: Confirmation */}
        {step === "confirmation" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-extrabold text-primary flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-secondary" />
                Confirme os dados
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Revise e corrija se necessário.
              </p>
            </div>

            {clarification && clarification.campos_faltantes.length > 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 text-sm">
                <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-foreground/80">
                    Campos não identificados:{" "}
                    <strong>{clarification.campos_faltantes.join(", ")}</strong>
                    .
                  </span>
                  {clarification.perguntas &&
                    clarification.perguntas.length > 0 && (
                      <span className="text-foreground/80 mt-1 block">
                        Ajuste a descrição do terreno de forma que responda a
                        seguinte questão:{" "}
                        <strong>{clarification.perguntas[0]}</strong>
                      </span>
                    )}
                </div>
              </div>
            )}

            <div>
              <label className="form-label">Cidade</label>
              <input
                className="form-input bg-muted/50 cursor-not-allowed"
                value={extracted?.cidade || "—"}
                readOnly
              />
            </div>

            <div>
              <label className="form-label">Área (m²)</label>
              <input
                className="form-input bg-muted/50 cursor-not-allowed"
                value={extracted?.area_m2 ? `${extracted.area_m2} m²` : "—"}
                readOnly
              />
            </div>

            <div>
              <label className="form-label">Valor total (R$)</label>
              <input
                className="form-input bg-muted/50 cursor-not-allowed"
                value={
                  extracted?.valor_total
                    ? formatCurrency(extracted.valor_total)
                    : "—"
                }
                readOnly
              />
            </div>

            {extracted?.area_m2 &&
              extracted?.valor_total &&
              extracted.area_m2 > 0 && (
                <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
                  <span className="text-sm text-muted-foreground">
                    Valor por m²:{" "}
                  </span>
                  <span className="text-lg font-bold text-secondary">
                    {formatCurrency(extracted.valor_total / extracted.area_m2)}
                  </span>
                </div>
              )}

            <div>
              <label className="form-label">
                Descrição do terreno (editável)
              </label>
              <textarea
                className="form-input min-h-[100px] resize-y"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Complemente a descrição com as informações faltantes"
              />
            </div>

            {clarification && (
              <button
                onClick={handleReprocess}
                className="btn-secondary-outline w-full"
              >
                <Loader2 className="w-4 h-4 mr-2" />
                Reprocessar descrição
              </button>
            )}

            <button
              onClick={handleConfirm}
              disabled={!extracted}
              className="btn-success w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirmar informações
            </button>
          </div>
        )}

        {/* STEP: Result */}
        {step === "result" && (
          <div className="space-y-6 text-center py-8">
            <div
              className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${prioridade === "ALTA" ? "bg-success/10" : "bg-secondary/10"}`}
            >
              <CheckCircle2
                className={`w-10 h-10 ${prioridade === "ALTA" ? "text-success" : "text-secondary"}`}
              />
            </div>

            <div>
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${prioridade === "ALTA" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}
              >
                Prioridade {prioridade}
              </span>
            </div>

            <h3 className="text-xl font-bold text-primary">
              Análise concluída
            </h3>

            <p className="text-foreground/80 text-sm leading-relaxed max-w-sm mx-auto">
              {resposta}
            </p>

            <div className="pt-4 space-y-3">
              <button
                onClick={() => {
                  resetFlow();
                }}
                className="btn-success w-full"
              >
                Enviar outra oportunidade
              </button>
              <button
                onClick={handleClose}
                className="btn-secondary-outline w-full"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
