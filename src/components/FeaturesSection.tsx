import {
  DollarSign,
  Home,
  Building,
  Warehouse,
  Map,
  Users,
  Search,
} from "lucide-react";

interface FeaturesSectionProps {
  onStartFlow: () => void;
}

const features = [
  { icon: Map, title: "Destinos", bold: "turísticos estratégicos" },
  { icon: Building, title: "Potencial para", bold: "novos empreendimentos" },
  {
    icon: Home,
    title: "Terrenos próximos ao",
    bold: "mar ou áreas valorizadas",
  },
  {
    icon: Users,
    title: "Proprietários interessados",
    bold: "em venda ou parceria",
  },
  { icon: Search, title: "Oportunidades", bold: "fora do mercado tradicional" },
];

const FeaturesSection = ({ onStartFlow }: FeaturesSectionProps) => {
  return (
    <section className="py-20 px-5 bg-muted">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title mb-2">
          Você pode indicar{" "}
          <span className="font-extrabold">a Seazone para:</span>
        </h2>
        <div className="w-20 h-1 rounded-full bg-accent mb-12" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="card-elevated flex flex-col items-start gap-4 p-7"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center">
                <f.icon className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-base font-semibold text-primary leading-snug">
                {f.title} <span className="font-extrabold">{f.bold}</span>
              </h3>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <button onClick={onStartFlow} className="btn-success text-base">
            Seja um parceiro Seazone
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
