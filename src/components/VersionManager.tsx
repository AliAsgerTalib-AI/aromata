import React, { useState } from 'react';
import { BlendingVersion } from '../types';

interface VersionManagerProps {
  versions: BlendingVersion[];
  currentDraftUnsaved: boolean;
  onSaveVersion: (snapshotName: string) => void;
  onRestoreVersion: (versionId: string) => void;
  onCompareVersions: (v1Id: string, v2Id: string) => void;
  onDeleteVersion: (versionId: string) => void;
}

export const VersionManager: React.FC<VersionManagerProps> = ({
  versions,
  currentDraftUnsaved,
  onSaveVersion,
  onRestoreVersion,
  onCompareVersions,
  onDeleteVersion
}) => {
  const [snapshotName, setSnapshotName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string | null>(null);

  const handleSave = () => {
    if (!snapshotName.trim()) return;
    onSaveVersion(snapshotName);
    setSnapshotName('');
    setShowSaveForm(false);
  };

  const handleCompare = (versionId: string) => {
    if (selectedForComparison && selectedForComparison !== versionId) {
      onCompareVersions(selectedForComparison, versionId);
      setSelectedForComparison(null);
    } else {
      setSelectedForComparison(selectedForComparison === versionId ? null : versionId);
    }
  };

  return (
    <div className="border-t pt-4 space-y-3">
      <h4 className="font-semibold text-gray-900">Version Manager</h4>

      {/* Save Button */}
      <div className="flex gap-2">
        {showSaveForm ? (
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Snapshot name (e.g., v6: More Floral)..."
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <button
              onClick={handleSave}
              disabled={!snapshotName.trim()}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 disabled:bg-gray-400"
            >
              Save
            </button>
            <button
              onClick={() => setShowSaveForm(false)}
              className="px-3 py-1 bg-gray-300 text-gray-900 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSaveForm(true)}
            className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
          >
            Save Snapshot
          </button>
        )}
      </div>

      {currentDraftUnsaved && (
        <p className="text-xs text-amber-600">✨ Current draft has unsaved changes</p>
      )}

      {/* Version History */}
      <div className="space-y-2">
        {versions.length === 0 ? (
          <p className="text-xs text-gray-500">No versions yet. Save your first snapshot above.</p>
        ) : (
          versions.map(version => (
            <div
              key={version.id}
              className={`p-2 rounded text-xs border ${
                selectedForComparison === version.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{version.snapshotName}</div>
                  <div className="text-gray-600 text-xs">
                    {new Date(version.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onRestoreVersion(version.id)}
                    className="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handleCompare(version.id)}
                    className={`font-medium ${
                      selectedForComparison === version.id
                        ? 'text-blue-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Compare
                  </button>
                  <button
                    onClick={() => onDeleteVersion(version.id)}
                    className="text-red-600 hover:text-red-900 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
