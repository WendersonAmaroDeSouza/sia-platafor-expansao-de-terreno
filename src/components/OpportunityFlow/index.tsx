import { useOpportunityFlowViewModel } from "./useOpportunityFlowViewModel";
import { OpportunityFlowView } from "./OpportunityFlowView";

interface OpportunityFlowProps {
  open: boolean;
  onClose: () => void;
}

const OpportunityFlow = (props: OpportunityFlowProps) => {
  const vm = useOpportunityFlowViewModel(props);
  return <OpportunityFlowView {...vm} />;
};

export default OpportunityFlow;
