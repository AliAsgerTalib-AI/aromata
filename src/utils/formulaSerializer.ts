import { CompoundingFormula } from '../types';

export interface SerializedFormula {
  version: '1.0';
  timestamp: string;
  appVersion: string;
  formula: CompoundingFormula;
  metadata?: {
    [key: string]: any;
  };
}

/**
 * Serializes a CompoundingFormula to JSON string with metadata
 */
export function serializeFormula(formula: CompoundingFormula): string {
  try {
    const appVersion = '1.0.0'; // Can be updated to use actual app version
    const serialized: SerializedFormula = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      appVersion,
      formula,
      metadata: {}
    };

    return JSON.stringify(serialized, null, 2);
  } catch (error) {
    console.error('Error serializing formula:', error);
    throw error;
  }
}

/**
 * Deserializes a JSON string to CompoundingFormula with validation
 */
export function deserializeFormula(json: string): CompoundingFormula | null {
  try {
    const parsed: SerializedFormula = JSON.parse(json.trim());

    // Validate version compatibility
    if (!parsed.version || parsed.version !== '1.0') {
      console.error('Unsupported serialization version:', parsed.version);
      return null;
    }

    // Validate required formula fields
    if (!parsed.formula || typeof parsed.formula !== 'object') {
      console.error('Invalid formula object in serialized data');
      return null;
    }

    const formula = parsed.formula as CompoundingFormula;

    // Validate essential formula structure
    if (
      typeof formula.blendName !== 'string' ||
      typeof formula.leadPerfumer !== 'string' ||
      !Array.isArray(formula.ingredients) ||
      !['ethanol', 'dpg', 'ipm'].includes(formula.carrierType) ||
      typeof formula.dilutionRatio !== 'number'
    ) {
      console.error('Invalid formula structure:', formula);
      return null;
    }

    return formula;
  } catch (error) {
    console.error('Error deserializing formula:', error);
    return null;
  }
}

/**
 * Triggers a browser download of the serialized formula
 */
export function downloadFormula(formula: CompoundingFormula, filename?: string): void {
  try {
    const json = serializeFormula(formula);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${formula.blendName || 'formula'}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading formula:', error);
    throw error;
  }
}
