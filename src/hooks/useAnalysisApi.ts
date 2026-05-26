import { useState } from 'react';
import { EnhancedFragranceAnalysis, ParsedBatchCode } from '../server/types/analysisTypes';

export function useAnalysisApi() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [batchResult, setBatchResult] = useState<ParsedBatchCode | null>(null);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [isVerifyingBatch, setIsVerifyingBatch] = useState(false);

  const analyzeFragrance = async (brand: string, name: string, compounds: any[] = []) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, name, compounds }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error((errData as any).error || 'Server returned an error');
      }

      const data = await response.json();
      return data.analysis as EnhancedFragranceAnalysis;
    } catch (err: any) {
      const message = err.message || 'Analysis failed';
      setErrorMessage(message);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const verifyBatchCode = async (brand: string, code: string) => {
    setIsVerifyingBatch(true);
    setBatchError(null);
    setBatchResult(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, name: code }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error((errData as any).error || 'Batch verification failed');
      }

      const data = await response.json();
      setBatchResult(data.analysis.parsedBatchCode);
      return data.analysis.parsedBatchCode;
    } catch (err: any) {
      const message = err.message || 'Batch verification failed';
      setBatchError(message);
      throw err;
    } finally {
      setIsVerifyingBatch(false);
    }
  };

  const layeringAnalysis = async (fragA: any, fragB: any) => {
    try {
      const response = await fetch('/api/layering-compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fragA, fragB }),
      });

      if (!response.ok) {
        throw new Error('Layering analysis failed');
      }

      return await response.json();
    } catch (err: any) {
      setErrorMessage(err.message || 'Layering analysis failed');
      throw err;
    }
  };

  return {
    isAnalyzing,
    errorMessage,
    setErrorMessage,
    batchResult,
    setBatchResult,
    batchError,
    setBatchError,
    isVerifyingBatch,
    analyzeFragrance,
    verifyBatchCode,
    layeringAnalysis,
  };
}
