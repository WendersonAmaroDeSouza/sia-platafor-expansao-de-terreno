import HeroSection from "@/components/HeroSection";
import TimelineSection from "@/components/TimelineSection";
import FeaturesSection from "@/components/FeaturesSection";
import OpportunityFlow from "@/components/OpportunityFlow";
import Footer from "@/components/Footer";
import { useIndexViewModel } from "./useIndexViewModel";

type Props = Readonly<ReturnType<typeof useIndexViewModel>>;

export function IndexView({ flowOpen, onOpenFlow, onCloseFlow }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection onStartFlow={onOpenFlow} />
      <TimelineSection />
      <FeaturesSection onStartFlow={onOpenFlow} />
      <Footer />
      <OpportunityFlow open={flowOpen} onClose={onCloseFlow} />
    </div>
  );
}
