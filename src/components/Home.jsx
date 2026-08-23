import { 
  Box, RefreshCw, Link, MessageCircle, Mic, Headphones, 
  BookOpen, Trophy, Gamepad2 
} from 'lucide-react';
import { cn } from '../utils/cn';
import GlassCard from './base/GlassCard';
import GradientButton from './base/GradientButton';
import IconBadge from './base/IconBadge';

const MODES = [
  { id: "construction", icon: Box, name: "Construcción", desc: "Arma frases seleccionando bloques", variant: "primary" },
  { id: "mutation", icon: RefreshCw, name: "Mutación", desc: "Transforma frases entre modos", variant: "success" },
  { id: "combination", icon: Link, name: "Combinación", desc: "Une frases con conectores", variant: "warning" },
  { id: "slang", icon: MessageCircle, name: "Slang", desc: "Adivina expresiones informales", variant: "error" },
  { id: "pronunciation", icon: Mic, name: "Pronunciación", desc: "Aprende trucos de pronunciación", variant: "purple" },
  { id: "listenbuild", icon: Headphones, name: "Escuchar y Construir", desc: "Escucha y arma la frase con bloques", variant: "cyan" },
];

export default function Home({ onStartMode, onStartMultiplayer }) {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="space-y-2 animate-fade-in-down">
        <h1 className="text-3xl font-extrabold tracking-tight text-text">
          ¡Practica inglés!
        </h1>
        <p className="text-text-secondary">
          Elige un modo para comenzar
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
        {MODES.map(mode => {
          const Icon = mode.icon;
          return (
            <GlassCard
              key={mode.id}
              className="cursor-pointer hover-lift"
              onClick={() => onStartMode(mode.id)}
            >
              <div className="flex items-start gap-4">
                <IconBadge icon={Icon} variant={mode.variant} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-text">{mode.name}</h3>
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                    {mode.desc}
                  </p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard
        className="cursor-pointer hover-lift animate-fade-in-up"
        onClick={() => onStartMode("course")}
      >
        <div className="flex items-center gap-4">
          <IconBadge icon={BookOpen} variant="primary" size="lg" />
          <div className="flex-1">
            <h3 className="font-bold text-text text-lg">Curso</h3>
            <p className="text-text-secondary">Aprende inglés paso a paso</p>
          </div>
        </div>
      </GlassCard>

      <GradientButton
        variant="primary"
        className="w-full animate-fade-in-up"
        onClick={() => onStartMode("competitive")}
      >
        <div className="flex items-center justify-center gap-3">
          <Trophy className="w-5 h-5" />
          <span>Modo Competitivo</span>
        </div>
      </GradientButton>

      <GradientButton
        variant="success"
        className="w-full animate-fade-in-up"
        onClick={onStartMultiplayer}
      >
        <div className="flex items-center justify-center gap-3">
          <Gamepad2 className="w-5 h-5" />
          <span>Multijugador</span>
        </div>
      </GradientButton>
    </div>
  );
}
