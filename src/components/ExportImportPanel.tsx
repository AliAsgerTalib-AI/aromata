import { useState, useRef, ChangeEvent } from 'react';
import { Download, Upload, Copy, Check } from 'lucide-react';
import { CompoundingFormula } from '../types';
import { serializeFormula, deserializeFormula, downloadFormula } from '../utils/formulaSerializer';

interface ExportImportPanelProps {
  formula: CompoundingFormula;
  onImportFormula: (formula: CompoundingFormula) => void;
}

export function ExportImportPanel({ formula, onImportFormula }: ExportImportPanelProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleExportJson = () => {
    try {
      const filename = formula.blendName
        ? `${formula.blendName.replace(/\s+/g, '-')}-${Date.now()}.json`
        : `formula-${Date.now()}.json`;
      downloadFormula(formula, filename);
      showMessage('success', 'Formula exported successfully');
    } catch (error) {
      showMessage('error', 'Failed to export formula');
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const json = serializeFormula(formula);
      await navigator.clipboard.writeText(json);
      showMessage('success', 'Formula copied to clipboard');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      showMessage('error', 'Failed to copy to clipboard');
    }
  };

  const handleImportFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedFormula = deserializeFormula(content);

        if (!importedFormula) {
          showMessage('error', 'Invalid formula file format');
          return;
        }

        onImportFormula(importedFormula);
        showMessage('success', 'Formula imported successfully');
      } catch (error) {
        console.error('Error importing formula:', error);
        showMessage('error', 'Failed to import formula');
      }
    };

    reader.onerror = () => {
      showMessage('error', 'Failed to read file');
    };

    reader.readAsText(file);

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const content = await navigator.clipboard.readText();
      const importedFormula = deserializeFormula(content);

      if (!importedFormula) {
        showMessage('error', 'Invalid formula in clipboard');
        return;
      }

      onImportFormula(importedFormula);
      showMessage('success', 'Formula pasted successfully');
    } catch (error) {
      console.error('Error pasting from clipboard:', error);
      showMessage('error', 'Failed to paste from clipboard');
    }
  };

  return (
    <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6 mb-6">
      <h3 className="text-[#0F9] text-xs font-mono uppercase mb-4">Export / Import Formula</h3>

      {/* Buttons Row */}
      <div className="flex gap-3 mb-4">
        {/* Export Button */}
        <button
          onClick={handleExportJson}
          className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white text-xs font-mono uppercase rounded-sm hover:bg-[#3B82F6]/80 transition"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>

        {/* Copy Button */}
        <button
          onClick={handleCopyToClipboard}
          className="flex items-center gap-2 px-4 py-2 bg-[#2D3139] text-[#E0E2E6] text-xs font-mono uppercase rounded-sm hover:bg-[#2D3139]/80 transition"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>

        {/* Import File Button */}
        <button
          onClick={handleImportFile}
          className="flex items-center gap-2 px-4 py-2 bg-[#2D3139] text-[#E0E2E6] text-xs font-mono uppercase rounded-sm hover:bg-[#2D3139]/80 transition"
        >
          <Upload className="w-4 h-4" />
          Import File
        </button>

        {/* Paste Button */}
        <button
          onClick={handlePasteFromClipboard}
          className="flex items-center gap-2 px-4 py-2 bg-[#2D3139] text-[#E0E2E6] text-xs font-mono uppercase rounded-sm hover:bg-[#2D3139]/80 transition"
        >
          <Copy className="w-4 h-4" />
          Paste
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`px-3 py-2 rounded-sm text-xs font-mono flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-[#0F9]/10 text-[#0F9] border border-[#0F9]'
              : 'bg-red-500/10 text-red-400 border border-red-500'
          }`}
        >
          {message.type === 'success' && <Check className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelected}
        style={{ display: 'none' }}
      />
    </div>
  );
}
