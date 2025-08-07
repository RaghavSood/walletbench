import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Clock, Trash2, Download } from 'lucide-react';
import { TestResult } from '../App';

interface TestResultsProps {
  results: TestResult[];
  onClear: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({ results, onClear }) => {
  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 size={16} className="text-brutal-green" />;
      case 'error':
        return <XCircle size={16} className="text-brutal-pink" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-brutal-yellow" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-brutal-green';
      case 'error':
        return 'bg-brutal-pink';
      case 'warning':
        return 'bg-brutal-yellow';
      default:
        return 'bg-gray-200';
    }
  };

  const exportResults = () => {
    const data = JSON.stringify(results, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wallet-test-results-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="bg-white brutal-border shadow-brutal-lg">
      <div className="p-4 bg-black text-white flex items-center justify-between">
        <h3 className="font-bold uppercase">Test Results</h3>
        <div className="flex gap-2">
          <button
            onClick={exportResults}
            disabled={results.length === 0}
            className="p-2 bg-white text-black brutal-border-sm hover:shadow-brutal-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
          </button>
          <button
            onClick={onClear}
            disabled={results.length === 0}
            className="p-2 bg-brutal-pink brutal-border-sm hover:shadow-brutal-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {results.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 uppercase text-sm">No test results yet</p>
            <p className="text-xs mt-2">Run some tests to see results here</p>
          </div>
        ) : (
          <div className="divide-y-2 divide-black">
            {results.map((result) => (
              <div key={result.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className={`p-1 ${getStatusColor(result.status)}`}>
                    {getStatusIcon(result.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm uppercase">{result.test}</p>
                    <p className="text-xs text-gray-600 mt-1">{result.message}</p>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="text-xs font-bold cursor-pointer uppercase">
                          View Data
                        </summary>
                        <pre className="text-xs mt-2 p-2 bg-gray-100 brutal-border-sm overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestResults;
