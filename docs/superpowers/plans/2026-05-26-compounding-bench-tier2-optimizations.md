# CompoundingBench Tier 2 Optimizations

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement three high-impact performance and scalability optimizations for CompoundingBench: ingredient pagination for large datasets, advanced chart memoization with data normalization, and simulation result caching.

**Architecture:** 
- **Ingredient Pagination**: Lazy-load ingredients in dropdown with 50-item batches, search within visible set, debounced filter updates
- **Chart Memoization Advanced**: Normalize chart data (merge identical timepoints) and memoize normalized data, preventing duplicate x-axis points
- **Simulation Caching**: LRU cache (20-item max) storing formula signatures (hash of ingredients/carrier/dilution) with TTL-based invalidation

**Tech Stack:** React hooks (useMemo, useCallback, useRef), crypto.subtle for formula hashing, custom LRU cache utility

---

### Task 1: Implement Ingredient Pagination in IngredientDropdown

**Files:**
- Modify: `src/components/IngredientDropdown.tsx:1-80`
- Modify: `src/context/IngredientContext.tsx:1-72` (add paginate method)
- Test: Verify dropdown loads 50 items, search filters within visible set

**Description:** Add lazy pagination to ingredient dropdown to handle 500+ ingredient library efficiently. Load first 50 items, fetch next batch on scroll or search.

- [ ] **Step 1: Add pagination method to IngredientContext**

In `src/context/IngredientContext.tsx`, add a paginate method:

```typescript
export const useIngredients = () => {
  const { combinedIngredients } = useContext(IngredientContext);
  
  const paginate = useCallback((items: typeof combinedIngredients, page: number = 0, pageSize: number = 50) => {
    const start = page * pageSize;
    return items.slice(start, start + pageSize);
  }, []);

  const searchIngredients = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return combinedIngredients.filter(ing =>
      ing.name.toLowerCase().includes(lowercaseQuery) ||
      ing.description?.toLowerCase().includes(lowercaseQuery)
    );
  }, [combinedIngredients]);

  return { combinedIngredients, searchIngredients, paginate };
};
```

- [ ] **Step 2: Update IngredientDropdown to use pagination**

In `src/components/IngredientDropdown.tsx`, refactor to use paginated loading:

```typescript
import { useState, useMemo, useCallback } from 'react';
import { useIngredients } from '../context/IngredientContext';
import { IngredientRow } from '../types';

const PAGE_SIZE = 50;

export function IngredientDropdown({ onSelect }: { onSelect: (ingredient: IngredientRow) => void }) {
  const { combinedIngredients, paginate } = useIngredients();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const filteredAndPaginated = useMemo(() => {
    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = combinedIngredients.filter(ing =>
      ing.name.toLowerCase().includes(lowercaseQuery) ||
      ing.description?.toLowerCase().includes(lowercaseQuery)
    );
    
    return {
      all: filtered,
      page: paginate(filtered, currentPage, PAGE_SIZE)
    };
  }, [searchQuery, currentPage, combinedIngredients, paginate]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isNearBottom = target.scrollHeight - target.scrollTop < 100;
    
    if (isNearBottom && (currentPage + 1) * PAGE_SIZE < filteredAndPaginated.all.length) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, filteredAndPaginated.all.length]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset to first page on search
  }, []);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search ingredient..."
        value={searchQuery}
        onChange={handleSearch}
        onFocus={() => setIsOpen(true)}
        className="w-full px-3 py-2 bg-[#1E2026] text-[#E0E2E6] border border-[#3B82F6] rounded text-sm"
      />
      
      {isOpen && (
        <div
          onScroll={handleScroll}
          className="absolute top-full left-0 right-0 mt-1 max-h-[300px] overflow-y-auto bg-[#1E2026] border border-[#3B82F6] rounded z-10"
        >
          {filteredAndPaginated.page.map(ing => (
            <button
              key={ing.id}
              onClick={() => {
                onSelect({ ...ing, ppt: 50 });
                setIsOpen(false);
                setSearchQuery('');
              }}
              className="w-full text-left px-3 py-2 hover:bg-[#3B82F6]/20 text-sm text-[#E0E2E6]"
            >
              <div className="font-semibold">{ing.name}</div>
              <div className="text-[#6A7180] text-xs">{ing.description}</div>
            </button>
          ))}
          
          {filteredAndPaginated.page.length === 0 && (
            <div className="px-3 py-2 text-[#6A7180] text-sm">No ingredients found</div>
          )}
          
          {currentPage < Math.ceil(filteredAndPaginated.all.length / PAGE_SIZE) - 1 && (
            <div className="px-3 py-2 text-[#6A7180] text-xs text-center">
              Scroll for more ({filteredAndPaginated.page.length} of {filteredAndPaginated.all.length})
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Test pagination works**

Manual test:
1. Click "Add Ingredient" dropdown
2. Type partial ingredient name (search should filter)
3. Scroll to bottom of 50-item list
4. Next 50 items should load automatically
5. Search should reset pagination to page 0

- [ ] **Step 4: Commit**

```bash
git add src/components/IngredientDropdown.tsx src/context/IngredientContext.tsx
git commit -m "feat: add ingredient pagination for dropdown (50-item lazy loading)"
```

---

### Task 2: Advanced Chart Memoization with Data Normalization

**Files:**
- Modify: `src/components/ChartContainer.tsx:1-76`
- Modify: `src/hooks/usePhysicsSimulation.ts:1-107` (export normalized data)
- Test: Verify charts don't re-render when normalization produces identical results

**Description:** Normalize chart data (merge duplicate timepoints) before memoization to prevent unnecessary re-renders when simulation returns slightly different time values.

- [ ] **Step 1: Create data normalization utility**

Create `src/utils/chartDataNormalizer.ts`:

```typescript
export interface EvaporationPoint {
  timeHours: number;
  volatilityPercent: number;
}

export const normalizeChartData = (data: EvaporationPoint[]): EvaporationPoint[] => {
  if (!data || data.length === 0) return [];
  
  // Group by timeHours (within 0.1 hour tolerance) and average volatilityPercent
  const grouped = new Map<string, EvaporationPoint[]>();
  
  data.forEach(point => {
    const roundedTime = Math.round(point.timeHours * 10) / 10;
    const key = roundedTime.toString();
    
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(point);
  });
  
  // Average duplicate points
  return Array.from(grouped.entries())
    .map(([, points]) => ({
      timeHours: points[0].timeHours,
      volatilityPercent: Math.round(
        points.reduce((sum, p) => sum + p.volatilityPercent, 0) / points.length
      )
    }))
    .sort((a, b) => a.timeHours - b.timeHours);
};
```

- [ ] **Step 2: Update ChartContainer to use normalized data**

Modify `src/components/ChartContainer.tsx`:

```typescript
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { normalizeChartData, EvaporationPoint } from '../utils/chartDataNormalizer';

interface ChartContainerProps {
  title: string;
  data: EvaporationPoint[];
  dataKey: string;
  xAxisKey: string;
  height?: number;
  description?: string;
}

function ChartContainerComponent({ title, data, dataKey, xAxisKey, height = 300, description }: ChartContainerProps) {
  // Normalize data on every render (memoized below)
  const normalizedData = useMemo(() => {
    return normalizeChartData(data);
  }, [data]);

  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-sm font-semibold text-[#E0E2E6]">{title}</h3>
        {description && <p className="text-xs text-[#6A7180]">{description}</p>}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={normalizedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2D3139" />
          <XAxis dataKey={xAxisKey} stroke="#6A7180" />
          <YAxis stroke="#6A7180" />
          <Tooltip contentStyle={{ backgroundColor: '#1E2026', border: '1px solid #3B82F6' }} />
          <Line type="monotone" dataKey={dataKey} stroke="#3B82F6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Memoize with custom comparison that accounts for normalized data
export const ChartContainer = React.memo(ChartContainerComponent, (prevProps, nextProps) => {
  // If data length differs, they're different
  if (prevProps.data.length !== nextProps.data.length) return false;
  
  // Normalize both and compare JSON
  const prevNormalized = JSON.stringify(normalizeChartData(prevProps.data));
  const nextNormalized = JSON.stringify(normalizeChartData(nextProps.data));
  
  // Return true if identical (props are equal, don't re-render)
  return prevNormalized === nextNormalized && prevProps.title === nextProps.title;
});
```

- [ ] **Step 3: Test normalization**

Verify in browser console:
1. Add ingredient, trigger simulation
2. Adjust PPT slightly (should not trigger chart re-render if normalized data is identical)
3. Open DevTools React Profiler, verify ChartContainer doesn't highlight as re-rendered

- [ ] **Step 4: Commit**

```bash
git add src/components/ChartContainer.tsx src/utils/chartDataNormalizer.ts
git commit -m "feat: normalize chart data to reduce unnecessary re-renders"
```

---

### Task 3: Simulation Result Caching with LRU Cache

**Files:**
- Create: `src/utils/formulaCache.ts`
- Modify: `src/hooks/usePhysicsSimulation.ts:1-107` (integrate cache)
- Test: Verify same formula returns cached result within 5 minutes

**Description:** Cache simulation results (max 20 formulas) keyed by formula signature hash. Return cached result if formula hasn't changed within 5-minute TTL.

- [ ] **Step 1: Create LRU cache utility**

Create `src/utils/formulaCache.ts`:

```typescript
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
```

- [ ] **Step 2: Integrate cache into usePhysicsSimulation hook**

Modify `src/hooks/usePhysicsSimulation.ts`:

```typescript
import { useState, useCallback, useRef, useEffect } from 'react';
import { CompoundingFormula, SimulationResult, IFRACompliance } from '../types';
import { formulaCache } from '../utils/formulaCache';

export const usePhysicsSimulation = (formula: CompoundingFormula) => {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [compliance, setCompliance] = useState<IFRACompliance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const triggerSimulation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      const formulaHash = await formulaCache.getFormulaHash(
        formula.ingredients,
        formula.carrierType,
        formula.dilutionRatio
      );

      const cached = formulaCache.get(formulaHash);
      if (cached) {
        setResult(cached.result);
        setCompliance(cached.compliance);
        setIsLoading(false);
        return;
      }

      // Cancel previous request
      abortController.current?.abort();
      abortController.current = new AbortController();

      const response = await fetch('/api/physics-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formula),
        signal: abortController.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Simulation failed');
      }

      const data = await response.json();
      
      // Cache the result
      formulaCache.set(formulaHash, data, data.ifraCompliance);
      
      setResult(data);
      setCompliance(data.ifraCompliance);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [formula]);

  // Debounced simulation trigger
  useEffect(() => {
    if (!formula.ingredients || formula.ingredients.length === 0) {
      setResult(null);
      setCompliance(null);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      triggerSimulation();
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [formula, triggerSimulation]);

  const retry = useCallback(() => {
    triggerSimulation();
  }, [triggerSimulation]);

  return { result, compliance, isLoading, error, retry };
};
```

- [ ] **Step 3: Test caching behavior**

Manual test:
1. Add ingredients, trigger simulation (should hit API)
2. Adjust unrelated UI state (e.g., formula name), keep formula constant
3. Simulation should return instantly from cache (no API call)
4. Wait 5+ minutes, adjust formula again
5. Should trigger new API call (cache expired)
6. Add 21st different formula
7. Oldest cached formula should evict to make room

- [ ] **Step 4: Commit**

```bash
git add src/hooks/usePhysicsSimulation.ts src/utils/formulaCache.ts
git commit -m "feat: implement formula result caching with LRU eviction and 5min TTL"
```

---

### Task 4: Integration Testing and Performance Verification

**Files:**
- No new files (verification only)
- Verify: All three optimizations compile and integrate

- [ ] **Step 1: Run type check**

```bash
npm run lint
```

Expected: No new type errors

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: Build completes, bundle size stable or improved

- [ ] **Step 3: Test in dev server**

1. Start dev server: `npm run dev`
2. Navigate to Compounding tab
3. Add multiple ingredients quickly (pagination loads 50 at a time)
4. Adjust carrier/dilution several times
5. Verify formula metadata changes without retriggering simulation (cache hit)
6. Register formula, add new formula with same composition
7. Verify instant result (cache hit)

- [ ] **Step 4: Commit integration**

```bash
git add -A
git commit -m "feat: tier 2 optimizations - ingredient pagination, advanced chart memoization, formula caching"
```
