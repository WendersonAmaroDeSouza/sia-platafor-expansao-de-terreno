import { useIndexViewModel } from "./useIndexViewModel";
import { IndexView } from "./IndexView";

export default function IndexPage() {
  const vm = useIndexViewModel();
  return <IndexView {...vm} />;
}
