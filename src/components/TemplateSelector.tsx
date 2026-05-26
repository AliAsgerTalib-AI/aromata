import { BookOpen } from 'lucide-react';
import { FormulaTemplate } from '../types';
import { FORMULA_TEMPLATES } from '../formulaTemplates';

interface TemplateSelectorProps {
  onSelectTemplate: (template: FormulaTemplate) => void;
}

const categoryColors: Record<FormulaTemplate['category'], string> = {
  Fresh: 'bg-blue-500/20 text-blue-300',
  Floral: 'bg-pink-500/20 text-pink-300',
  Woody: 'bg-amber-500/20 text-amber-300',
  Oriental: 'bg-purple-500/20 text-purple-300'
};

const categoryBorders: Record<FormulaTemplate['category'], string> = {
  Fresh: 'border-blue-500/30',
  Floral: 'border-pink-500/30',
  Woody: 'border-amber-500/30',
  Oriental: 'border-purple-500/30'
};

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6 mb-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-[#0F9]" />
          <h3 className="text-[#0F9] text-xs font-mono uppercase">📚 Formula Templates</h3>
        </div>
        <p className="text-[#6A7180] text-sm">
          Start with a pre-designed formula and customize it to your needs
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-2 gap-4">
        {FORMULA_TEMPLATES.map(template => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className={`text-left p-4 rounded-sm border transition-all hover:border-[#3B82F6] hover:bg-[#0A0B0E] ${categoryBorders[template.category]} border-[#2D3139]`}
          >
            {/* Category Badge */}
            <div className={`inline-block px-2 py-1 rounded text-xs font-mono uppercase mb-2 ${categoryColors[template.category]}`}>
              {template.category}
            </div>

            {/* Template Name */}
            <h4 className="text-[#E0E2E6] font-bold text-sm mb-2">
              {template.name}
            </h4>

            {/* Description */}
            <p className="text-[#6A7180] text-xs mb-3 line-clamp-2">
              {template.description}
            </p>

            {/* Ingredients Preview */}
            <div className="text-[#6A7180] text-xs space-y-1 mb-3">
              {template.ingredients.map(ing => (
                <div key={ing.id} className="flex items-center gap-1">
                  <span className="text-[#0F9]">•</span>
                  <span>{ing.chemicalName}</span>
                </div>
              ))}
            </div>

            {/* Use Template Button */}
            <div className="flex items-center gap-2 text-[#0F9] text-xs font-mono uppercase hover:text-[#0F9]/80">
              <span>Use Template</span>
              <span>→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
