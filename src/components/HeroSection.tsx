import { MapPin, TrendingUp, Send } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroSectionProps {
  onStartFlow: () => void;
}

const HeroSection = ({ onStartFlow }: HeroSectionProps) => {
  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="hero-gradient absolute inset-0" />
      <div className="relative z-10 max-w-7xl mx-auto px-5 w-full py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="animate-float-in">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/20">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <span className="text-accent font-bold uppercase tracking-wider text-sm">
                Portal Sia
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-6">
              Envie oportunidades de{" "}
              <span className="text-accent-highlight">terrenos</span> e deixe a{" "}
              <span className="text-accent-highlight">Sia</span> analisar.
            </h1>

            <p className="text-lg text-primary-foreground/90 max-w-xl mb-8 leading-relaxed">
              No programa de parcerias da Seazone, você envia terrenos, a nossa
              IA analisa automaticamente e encaminha para o time de expansão.
              Simples, rápido e sem cadastro.
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={onStartFlow} className="btn-success text-base">
                <Send className="w-4 h-4 mr-2" />
                Enviar oportunidade
              </button>
            </div>

            <div className="flex items-center gap-6 mt-10 text-primary-foreground/70 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Sem login necessário
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Análise em segundos
              </div>
            </div>
          </div>

          {/* Right - form card preview */}
          <div className="hidden md:flex justify-end animate-float-in" style={{ animationDelay: "0.2s" }}>
            <div className="card-elevated max-w-md w-full p-10">
              <h3 className="text-xl font-bold text-primary mb-2">
                Como funciona?
              </h3>
              <div className="w-16 h-1 rounded-full bg-accent mb-6" />
              <div className="space-y-5">
                {[
                  { step: "1", text: "Descreva o terreno em texto livre" },
                  { step: "2", text: "A Sia extrai os dados automaticamente" },
                  { step: "3", text: "Confirme e envie para análise" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-sm">
                      {item.step}
                    </div>
                    <p className="text-foreground/80 text-sm pt-1">{item.text}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={onStartFlow}
                className="btn-success w-full mt-8 text-sm"
              >
                Começar agora
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
