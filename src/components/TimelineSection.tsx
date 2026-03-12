import { Building2, BedDouble, MapPin, Star, Handshake } from "lucide-react";

const steps = [
  {
    icon: Building2,
    title: "Estruturação de empreendimentos",
    desc: "Estruturação de empreendimentos e auditoria de obras.",
  },
  {
    icon: BedDouble,
    title: "Gestão de imóveis para aluguel por temporada",
    desc: "Gestão completa do imóvel para garantir a máxima rentabilidade.",
  },
  {
    icon: MapPin,
    title: "Tecnologia para dados e escalabilidade",
    desc: "Dados de mercado para encontrar as melhores oportunidades.",
  },
  {
    icon: Star,
    title: "Hospedagem com conveniência",
    desc: "Imóveis preparados e decorados por profissionais.",
  },
  {
    icon: Handshake,
    title: "Parcerias",
    desc: "Apoiamos imobiliárias, corretores e analistas de investimentos.",
  },
];

const TimelineSection = () => {
  return (
    <section className="py-20 px-5 bg-card">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title mb-2">
          Transformamos o imóvel em um investimento de{" "}
          <span className="font-extrabold">alta rentabilidade</span>
        </h2>
        <div className="w-20 h-1 rounded-full bg-accent mb-16" />

        {/* Timeline */}
        <div className="relative">
          {/* Line */}
          <div className="hidden md:block absolute top-[40px] left-0 right-0 h-1.5 bg-gradient-to-r from-secondary via-accent to-accent rounded-full" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center relative">
                {/* Icon */}
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 rounded-full bg-card border-2 border-secondary flex items-center justify-center relative z-10">
                    <step.icon className="w-7 h-7 text-secondary" />
                  </div>
                </div>
                {/* Dot on line */}
                <div className="hidden md:flex justify-center mb-4">
                  <div className="w-4 h-4 rounded-full bg-card border-4 border-secondary" />
                </div>
                <h4 className="font-bold text-primary text-sm mb-2 leading-snug">
                  {i % 2 === 0 ? (
                    step.title
                  ) : (
                    <span className="text-accent-highlight">{step.title}</span>
                  )}
                </h4>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
