import { useState } from "react";

export function useIndexViewModel() {
  const [flowOpen, setFlowOpen] = useState(false);

  const onOpenFlow = () => setFlowOpen(true);
  const onCloseFlow = () => setFlowOpen(false);

  return {
    flowOpen,
    onOpenFlow,
    onCloseFlow,
  };
}
