import { Wind, Droplet } from 'lucide-react';
import { FragranceData } from '../types';

interface DensityShiftAnalyzerProps {
  fragrance: FragranceData;
}

export function DensityShiftAnalyzer({ fragrance }: DensityShiftAnalyzerProps) {
  const analysis = fragrance.densityShiftAnalysis;

  if (!analysis) {
    return null;
  }

  const sectionTitle = `${analysis.familyFocus} Density Shift`;

  return (
    <div className="bg-gradient-to-r from-[#15181F] to-[#0A0B0E] border border-[#2D3139] rounded-sm p-8 space-y-6">
      {/* Section Title */}
      <h3 className="text-2xl font-bold text-white mb-6">{sectionTitle}</h3>

      {/* High Volatility Scaffolding */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-[#3B82F6]" />
          <h4 className="text-sm font-mono font-bold text-[#3B82F6] uppercase tracking-wider">
            High Volatility Scaffolding (Radiative Focus)
          </h4>
        </div>

        <div className="space-y-3 ml-7">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#6A7180] font-bold tracking-wider block mb-1">
              Molecular Engine
            </span>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              {analysis.highVolatilityEngine}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-[#6A7180] font-bold tracking-wider block mb-1">
              Diffusion Effect
            </span>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              {analysis.diffusionEffect}
            </p>
          </div>
        </div>
      </div>

      {/* Low Volatility Scaffolding */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Droplet className="w-5 h-5 text-[#10B981]" />
          <h4 className="text-sm font-mono font-bold text-[#10B981] uppercase tracking-wider">
            Low Volatility Scaffolding (Density Focus)
          </h4>
        </div>

        <div className="space-y-3 ml-7">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#6A7180] font-bold tracking-wider block mb-1">
              Molecular Engine
            </span>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              {analysis.lowVolatilityEngine}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-[#6A7180] font-bold tracking-wider block mb-1">
              Tenacity Effect
            </span>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              {analysis.tenacityEffect}
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Portfolio Takeaway */}
      <div className="space-y-3 pt-4 border-t border-[#2D3139]">
        <h4 className="text-sm font-mono font-bold text-[#F59E0B] uppercase tracking-wider">
          Strategic Portfolio Takeaway
        </h4>
        <p className="text-sm text-[#9CA3AF] leading-relaxed">
          {analysis.strategicPortfolioTakeaway}
        </p>
      </div>
    </div>
  );
}
