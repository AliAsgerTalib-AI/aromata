import React from 'react';

interface QueryPanelProps {
  queries: Record<string, string>;
  layerName: string;
}

export const QueryPanel: React.FC<QueryPanelProps> = ({ queries, layerName }) => {
  const [selectedQuery, setSelectedQuery] = React.useState<string | null>(null);

  const queryEntries = Object.entries(queries);
  if (queryEntries.length === 0) return null;

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Expert Queries</h4>
      <div className="space-y-2">
        {queryEntries.map(([key, answer]) => {
          const queryLabel = key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          return (
            <div key={key} className="bg-gray-50 rounded p-3">
              <button
                onClick={() => setSelectedQuery(selectedQuery === key ? null : key)}
                className="w-full text-left text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                <span className="inline-block mr-2">
                  {selectedQuery === key ? '▼' : '▶'}
                </span>
                {queryLabel}?
              </button>
              {selectedQuery === key && (
                <div className="mt-2 text-sm text-gray-700 bg-white p-2 rounded border-l-2 border-indigo-500">
                  {answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
