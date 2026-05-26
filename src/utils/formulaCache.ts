import { SimulationResult, IFRACompliance } from '../types';

interface CacheEntry {
  result: SimulationResult;
  compliance: IFRACompliance;
  timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const CACHE_MAX_SIZE = 20;

export class FormulaCache {
  private cache = new Map<string, CacheEntry>();

  async getFormulaHash(ingredients: any[], carrierType: string, dilutionRatio: number): Promise<string> {
    const data = JSON.stringify({ ingredients, carrierType, dilutionRatio });
    const encoded = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  get(hash: string): CacheEntry | null {
    const entry = this.cache.get(hash);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > CACHE_TTL_MS) {
      this.cache.delete(hash);
      return null;
    }

    return entry;
  }

  set(hash: string, result: SimulationResult, compliance: IFRACompliance): void {
    // Evict oldest entry if at capacity
    if (this.cache.size >= CACHE_MAX_SIZE) {
      const oldestKey = Array.from(this.cache.keys())[0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(hash, {
      result,
      compliance,
      timestamp: Date.now()
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const formulaCache = new FormulaCache();
