import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Eye, Play, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { TestResult } from '../App';

interface ReadOnlyTestsProps {
  provider: ethers.BrowserProvider;
  account: string;
  onTestResult: (result: TestResult) => void;
}

interface ReadOnlyTest {
  name: string;
  method: string;
  execute: () => Promise<any>;
}

const ReadOnlyTests: React.FC<ReadOnlyTestsProps> = ({
  provider,
  account,
  onTestResult
}) => {
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<Map<string, boolean>>(new Map());
  const [currentTest, setCurrentTest] = useState('');

  const readOnlyTests: ReadOnlyTest[] = [
    {
      name: 'Block Number',
      method: 'eth_blockNumber',
      execute: async () => await provider.send('eth_blockNumber', [])
    },
    {
      name: 'Chain ID',
      method: 'eth_chainId',
      execute: async () => await provider.send('eth_chainId', [])
    },
    {
      name: 'Gas Price',
      method: 'eth_gasPrice',
      execute: async () => await provider.send('eth_gasPrice', [])
    },
    {
      name: 'Get Balance',
      method: 'eth_getBalance',
      execute: async () => await provider.send('eth_getBalance', [account, 'latest'])
    },
    {
      name: 'Transaction Count',
      method: 'eth_getTransactionCount',
      execute: async () => await provider.send('eth_getTransactionCount', [account, 'latest'])
    },
    {
      name: 'Get Code',
      method: 'eth_getCode',
      execute: async () => await provider.send('eth_getCode', ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 'latest'])
    },
    {
      name: 'Get Storage At',
      method: 'eth_getStorageAt',
      execute: async () => await provider.send('eth_getStorageAt', ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', '0x0', 'latest'])
    },
    {
      name: 'Get Block By Number',
      method: 'eth_getBlockByNumber',
      execute: async () => await provider.send('eth_getBlockByNumber', ['latest', false])
    },
    {
      name: 'Get Block By Hash',
      method: 'eth_getBlockByHash',
      execute: async () => {
        const block = await provider.getBlock('latest');
        return await provider.send('eth_getBlockByHash', [block!.hash, false]);
      }
    },
    {
      name: 'Get Transaction Receipt',
      method: 'eth_getTransactionReceipt',
      execute: async () => {
        // Use a known transaction hash
        return await provider.send('eth_getTransactionReceipt', ['0x0000000000000000000000000000000000000000000000000000000000000000']);
      }
    },
    {
      name: 'Get Logs',
      method: 'eth_getLogs',
      execute: async () => await provider.send('eth_getLogs', [{
        fromBlock: 'latest',
        toBlock: 'latest'
      }])
    },
    {
      name: 'Fee History',
      method: 'eth_feeHistory',
      execute: async () => await provider.send('eth_feeHistory', [4, 'latest', [25, 50, 75]])
    },
    {
      name: 'Get Proof',
      method: 'eth_getProof',
      execute: async () => await provider.send('eth_getProof', [account, [], 'latest'])
    },
    {
      name: 'Syncing',
      method: 'eth_syncing',
      execute: async () => await provider.send('eth_syncing', [])
    },
    {
      name: 'Coinbase',
      method: 'eth_coinbase',
      execute: async () => await provider.send('eth_coinbase', [])
    },
    {
      name: 'Get Uncle Count By Block Hash',
      method: 'eth_getUncleCountByBlockHash',
      execute: async () => {
        const block = await provider.getBlock('latest');
        return await provider.send('eth_getUncleCountByBlockHash', [block!.hash]);
      }
    },
    {
      name: 'Get Uncle Count By Block Number',
      method: 'eth_getUncleCountByBlockNumber',
      execute: async () => await provider.send('eth_getUncleCountByBlockNumber', ['latest'])
    },
    {
      name: 'Get Block Transaction Count By Hash',
      method: 'eth_getBlockTransactionCountByHash',
      execute: async () => {
        const block = await provider.getBlock('latest');
        return await provider.send('eth_getBlockTransactionCountByHash', [block!.hash]);
      }
    },
    {
      name: 'Get Block Transaction Count By Number',
      method: 'eth_getBlockTransactionCountByNumber',
      execute: async () => await provider.send('eth_getBlockTransactionCountByNumber', ['latest'])
    },
    {
      name: 'Get Transaction By Block Hash And Index',
      method: 'eth_getTransactionByBlockHashAndIndex',
      execute: async () => {
        const block = await provider.getBlock('latest');
        return await provider.send('eth_getTransactionByBlockHashAndIndex', [block!.hash, '0x0']);
      }
    },
    {
      name: 'Get Transaction By Block Number And Index',
      method: 'eth_getTransactionByBlockNumberAndIndex',
      execute: async () => await provider.send('eth_getTransactionByBlockNumberAndIndex', ['latest', '0x0'])
    },
    {
      name: 'Get Transaction By Hash',
      method: 'eth_getTransactionByHash',
      execute: async () => await provider.send('eth_getTransactionByHash', ['0x0000000000000000000000000000000000000000000000000000000000000000'])
    },
    {
      name: 'Get Filter Changes',
      method: 'eth_getFilterChanges',
      execute: async () => {
        const filterId = await provider.send('eth_newBlockFilter', []);
        const changes = await provider.send('eth_getFilterChanges', [filterId]);
        await provider.send('eth_uninstallFilter', [filterId]);
        return changes;
      }
    },
    {
      name: 'Get Filter Logs',
      method: 'eth_getFilterLogs',
      execute: async () => {
        const filterId = await provider.send('eth_newFilter', [{
          fromBlock: 'latest',
          toBlock: 'latest'
        }]);
        const logs = await provider.send('eth_getFilterLogs', [filterId]);
        await provider.send('eth_uninstallFilter', [filterId]);
        return logs;
      }
    },
    {
      name: 'Uninstall Filter',
      method: 'eth_uninstallFilter',
      execute: async () => {
        const filterId = await provider.send('eth_newBlockFilter', []);
        return await provider.send('eth_uninstallFilter', [filterId]);
      }
    },
    {
      name: 'Unsubscribe',
      method: 'eth_unsubscribe',
      execute: async () => {
        try {
          const subId = await provider.send('eth_subscribe', ['newHeads']);
          return await provider.send('eth_unsubscribe', [subId]);
        } catch {
          throw new Error('Subscriptions not supported');
        }
      }
    },
    {
      name: 'Client Version',
      method: 'web3_clientVersion',
      execute: async () => await provider.send('web3_clientVersion', [])
    }
  ];

  const runAllTests = async () => {
    setTesting(true);
    const results = new Map<string, boolean>();

    for (const test of readOnlyTests) {
      setCurrentTest(test.method);
      try {
        const result = await test.execute();
        results.set(test.method, true);
        
        onTestResult({
          id: Date.now().toString() + test.method,
          category: 'readonly',
          test: test.method,
          status: 'success',
          message: `${test.name} passed`,
          data: result,
          timestamp: Date.now()
        });
      } catch (error: any) {
        results.set(test.method, false);
        
        onTestResult({
          id: Date.now().toString() + test.method,
          category: 'readonly',
          test: test.method,
          status: 'error',
          message: `${test.name} failed: ${error.message}`,
          timestamp: Date.now()
        });
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setTestResults(results);
    setCurrentTest('');
    setTesting(false);

    // Summary
    const passed = Array.from(results.values()).filter(v => v).length;
    const failed = results.size - passed;
    
    onTestResult({
      id: Date.now().toString() + '_summary',
      category: 'readonly',
      test: 'Summary',
      status: failed === 0 ? 'success' : 'warning',
      message: `Tests completed: ${passed} passed, ${failed} failed out of ${results.size} total`,
      timestamp: Date.now()
    });
  };

  const getTestStatus = (method: string) => {
    if (currentTest === method) return 'testing';
    if (!testResults.has(method)) return 'pending';
    return testResults.get(method) ? 'passed' : 'failed';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-black text-white p-2">
            <Eye size={24} />
          </div>
          <h2 className="text-2xl font-bold uppercase">Read-Only Methods</h2>
        </div>
        <button
          onClick={runAllTests}
          disabled={testing}
          className="bg-brutal-green brutal-border-sm px-4 py-2 shadow-brutal-sm hover:shadow-brutal transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {testing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Play size={16} />
              Run All Tests
            </>
          )}
        </button>
      </div>

      {/* Test Progress */}
      {testing && (
        <div className="mb-6 bg-brutal-yellow brutal-border-sm p-4">
          <p className="font-bold uppercase">Testing in progress...</p>
          <p className="text-sm mt-1">Current: {currentTest}</p>
        </div>
      )}

      {/* Test Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {readOnlyTests.map(test => {
          const status = getTestStatus(test.method);
          return (
            <div
              key={test.method}
              className={`
                brutal-border-sm p-4 ${
                  status === 'passed' ? 'bg-brutal-green' :
                  status === 'failed' ? 'bg-brutal-red' :
                  status === 'testing' ? 'bg-brutal-yellow' :
                  'bg-white'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm uppercase">{test.name}</h3>
                  <p className="text-xs text-gray-600 font-mono">{test.method}</p>
                </div>
                <div className="flex items-center">
                  {status === 'testing' && <Loader2 size={16} className="animate-spin" />}
                  {status === 'passed' && <CheckCircle2 size={16} className="text-green-600" />}
                  {status === 'failed' && <XCircle size={16} className="text-red-600" />}
                  {status === 'pending' && <div className="w-4 h-4 border brutal-border-sm bg-gray-200" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Test Summary */}
      {testResults.size > 0 && (
        <div className="mt-6 bg-black text-white brutal-border-sm p-4">
          <h3 className="font-bold uppercase mb-2">Test Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{testResults.size}</div>
              <div className="text-xs uppercase">Total</div>
            </div>
            <div className="text-green-400">
              <div className="text-2xl font-bold">
                {Array.from(testResults.values()).filter(v => v).length}
              </div>
              <div className="text-xs uppercase">Passed</div>
            </div>
            <div className="text-red-400">
              <div className="text-2xl font-bold">
                {Array.from(testResults.values()).filter(v => !v).length}
              </div>
              <div className="text-xs uppercase">Failed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadOnlyTests;