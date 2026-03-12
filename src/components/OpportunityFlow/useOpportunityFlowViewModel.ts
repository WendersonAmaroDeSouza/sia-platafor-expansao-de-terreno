import { useState, useEffect } from "react";
import { extractOpportunityDataUseCase } from "@/services/opportunities/useCases/extractOpportunityDataUseCase";
import { getUserContactUseCase } from "@/services/userPreferences/useCases/getUserContactUseCase";
import { saveUserContactUseCase } from "@/services/userPreferences/useCases/saveUserContactUseCase";
import {
  OpportunityData,
  ClarificationData,
  Priority,
} from "@/services/opportunities/models/Opportunity";

export type FlowStep =
  | "form"
  | "processing"
  | "confirmation"
  | "result"
  | "clarification";

interface UseOpportunityFlowViewModelProps {
  open: boolean;
  onClose: () => void;
}

export function useOpportunityFlowViewModel({
  open,
  onClose,
}: UseOpportunityFlowViewModelProps) {
  const [step, setStep] = useState<FlowStep>("form");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [descricao, setDescricao] = useState("");

  const [extracted, setExtracted] = useState<OpportunityData | null>(null);
  const [clarification, setClarification] = useState<ClarificationData | null>(
    null,
  );
  const [prioridade, setPrioridade] = useState<Priority>("BAIXA"); // Default or from N8N
  const [resposta, setResposta] = useState("");

  useEffect(() => {
    const loadUserContact = async () => {
      const result = await getUserContactUseCase();
      if (result.ok && result.data) {
        setNome(result.data.name);
        setEmail(result.data.email);
      }
    };

    if (open) {
      loadUserContact();
    }
  }, [open]);

  const resetFlow = () => {
    setStep("form");
    setDescricao("");
    setExtracted(null);
    setClarification(null);
    setPrioridade("BAIXA");
    setResposta("");
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !descricao.trim()) return;

    saveUserContactUseCase({ name: nome, email: email });

    setStep("processing");
    setExtracted(null);
    setClarification(null);

    const result = await extractOpportunityDataUseCase(descricao, email, nome);

    if (result.ok) {
      if (result.data.type === "success") {
        setExtracted(result.data.data);
        setPrioridade(result.data.data.prioridade);
        setStep("confirmation");
      } else {
        setClarification(result.data.data);
        setStep("confirmation");
      }
    } else {
      setStep("form");
      alert(result.error?.message || "Erro ao processar. Tente novamente.");
    }
  };

  const handleReprocess = async () => {
    setStep("processing");

    const result = await extractOpportunityDataUseCase(descricao, email, nome);
    if (result.ok) {
      if (result.data.type === "success") {
        setExtracted(result.data.data);
        setPrioridade(result.data.data.prioridade);
        setClarification(null);
        setStep("confirmation");
      } else {
        setClarification(result.data.data);
        setExtracted(null);
        setStep("confirmation");
      }
    } else {
      setStep("confirmation");
      alert("Erro ao reprocessar.");
    }
  };

  const handleConfirm = async () => {
    if (!extracted) return;

    if (prioridade === "ALTA") {
      setResposta(
        `Excelente! Já encaminhei sua proposta
para nosso time de expansão.`,
      );
    } else {
      setResposta(
        `No momento não estamos operando nesta região,
mas guardaremos seu contato.`,
      );
    }

    setStep("result");
  };

  const handleClose = () => {
    onClose();
    resetFlow();
  };

  return {
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
    resetFlow,
    handleClose,
    open,
  };
}
