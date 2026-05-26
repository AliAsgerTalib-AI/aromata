import { FragranceConcentration } from './types';

export function getConcentrationFromDilution(dilutionPercent: number): FragranceConcentration {
  if (dilutionPercent <= 8) return FragranceConcentration.COLOGNE;
  if (dilutionPercent <= 15) return FragranceConcentration.TOILETTE;
  if (dilutionPercent <= 24) return FragranceConcentration.PARFUM;
  if (dilutionPercent <= 40) return FragranceConcentration.EXTRAIT;
  return FragranceConcentration.PURE_PARFUM;
}

export function getConcentrationMultiplier(concentration: string): number {
  const lower = concentration.toLowerCase();
  const multipliers: Record<string, number> = {
    'extrait': 4.0,
    'pure': 4.0,
    'parfum': 3.0,
    'edp': 3.0,
    'toilette': 2.0,
    'edt': 2.0,
    'cologne': 1.0,
    'edc': 1.0
  };

  for (const [key, value] of Object.entries(multipliers)) {
    if (lower.includes(key)) {
      return value;
    }
  }
  return 1.0;
}

export function getConcentrationLabel(concentration: string): string {
  const lower = concentration.toLowerCase();
  const labels: Record<string, string> = {
    'cologne': 'EDC',
    'edc': 'EDC',
    'toilette': 'EDT',
    'edt': 'EDT',
    'parfum': 'EDP',
    'edp': 'EDP',
    'extrait': 'Extrait',
    'pure': 'Pure Parfum'
  };

  for (const [key, label] of Object.entries(labels)) {
    if (lower.includes(key)) {
      return label;
    }
  }
  return 'EDT';
}
