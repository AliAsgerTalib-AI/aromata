import { EnhancedFragranceAnalysis } from '../types/analysisTypes';

interface CacheEntry {
  data: EnhancedFragranceAnalysis;
  timestamp: number;
}

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

class AnalysisCache {
  private cache: Map<string, CacheEntry> = new Map();

  getCacheKey(brand: string, name: string): string {
    return `${brand}||${name}`.toLowerCase();
  }

  get(brand: string, name: string): EnhancedFragranceAnalysis | null {
    const key = this.getCacheKey(brand, name);
    const entry = this.cache.get(key);

    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > CACHE_TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(brand: string, name: string, data: EnhancedFragranceAnalysis): void {
    const key = this.getCacheKey(brand, name);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear(brand?: string, name?: string): void {
    if (brand && name) {
      const key = this.getCacheKey(brand, name);
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  getSize(): number {
    return this.cache.size;
  }
}

export const analysisCache = new AnalysisCache();
