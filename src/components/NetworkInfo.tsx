import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Network, Globe, Server, Activity, RefreshCw, Loader2 } from 'lucide-react';
import { TestResult } from '../App';

interface NetworkInfoProps {
  provider: ethers.BrowserProvider;
  account: string;
  onTestResult: (result: TestResult) => void;
}

const NetworkInfo: React.FC<NetworkInfoProps> = ({
  provider,
  account,
  onTestResult
}) => {
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState('');

  useEffect(() => {
    fetchNetworkInfo();
  }, [provider]);

  const fetchNetworkInfo = async () => {
    setLoading(true);
    try {
      const network = await provider.getNetwork();
      const block = await provider.getBlock('latest');
      const gasPrice = await provider.getFeeData();
      const balance = await provider.getBalance(account);
      const txCount = await provider.getTransactionCount(account);

      setNetworkInfo({
        chainId: network.chainId.toString(),
        name: network.name,
        blockNumber: block?.number,
        blockTimestamp: block?.timestamp,
        gasPrice: gasPrice.gasPrice ? ethers.formatUnits(gasPrice.gasPrice, 'gwei') : null,
        maxFeePerGas: gasPrice.maxFeePerGas ? ethers.formatUnits(gasPrice.maxFeePerGas, 'gwei') : null,
        maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas ? ethers.formatUnits(gasPrice.maxPriorityFeePerGas, 'gwei') : null,
        balance: ethers.formatEther(balance),
        nonce: txCount
      });
    } catch (error) {
      console.error('Failed to fetch network info:', error);
    } finally {
      setLoading(false);
    }
  };

  const testNetworkSwitch = async () => {
    setTesting('switch');
    try {
      // Try to switch to Sepolia testnet
      await provider.send('wallet_switchEthereumChain', [
        { chainId: '0xaa36a7' } // Sepolia chainId in hex
      ]);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'network',
        test: 'Network Switch',
        status: 'success',
        message: 'Successfully requested network switch',
        timestamp: Date.now()
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added, try to add it
        try {
          await provider.send('wallet_addEthereumChain', [
            {
              chainId: '0xaa36a7',
              chainName: 'Sepolia Testnet',
              nativeCurrency: {
                name: 'Sepolia ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io']
            }
          ]);
          
          onTestResult({
            id: Date.now().toString(),
            category: 'network',
            test: 'Add Network',
            status: 'success',
            message: 'Successfully added new network',
            timestamp: Date.now()
          });
        } catch (addError: any) {
          onTestResult({
            id: Date.now().toString(),
            category: 'network',
            test: 'Add Network',
            status: 'error',
            message: addError.message || 'Failed to add network',
            timestamp: Date.now()
          });
        }
      } else {
        onTestResult({
          id: Date.now().toString(),
          category: 'network',
          test: 'Network Switch',
          status: 'error',
          message: error.message || 'Failed to switch network',
          timestamp: Date.now()
        });
      }
    } finally {
      setTesting('');
    }
  };

  const testWatchAsset = async () => {
    setTesting('asset');
    try {
      const wasAdded = await provider.send('wallet_watchAsset', {
        type: 'ERC20',
        options: {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
          symbol: 'USDC',
          decimals: 6,
          image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
        }
      });
      
      onTestResult({
        id: Date.now().toString(),
        category: 'network',
        test: 'Watch Asset',
        status: wasAdded ? 'success' : 'warning',
        message: wasAdded ? 'Asset added successfully' : 'User declined to add asset',
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'network',
        test: 'Watch Asset',
        status: 'error',
        message: error.message || 'Failed to add asset',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testPermissions = async () => {
    setTesting('permissions');
    try {
      const permissions = await provider.send('wallet_getPermissions', []);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'network',
        test: 'Get Permissions',
        status: 'success',
        message: `Retrieved ${permissions.length} permission(s)`,
        data: permissions,
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'network',
        test: 'Get Permissions',
        status: 'error',
        message: error.message || 'Failed to get permissions',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-black text-white p-2">
            <Network size={24} />
          </div>
          <h2 className="text-2xl font-bold uppercase">Network & RPC Tests</h2>
        </div>
        <button
          onClick={fetchNetworkInfo}
          disabled={loading}
          className="bg-black text-white p-2 brutal-border-sm shadow-brutal-sm hover:shadow-brutal transition-all"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <RefreshCw size={20} />
          )}
        </button>
      </div>

      {/* Network Info Display */}
      {networkInfo && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-brutal-cyan brutal-border-sm p-3">
            <p className="text-xs font-bold uppercase">Chain ID</p>
            <p className="text-lg font-bold">{networkInfo.chainId}</p>
          </div>
          <div className="bg-brutal-green brutal-border-sm p-3">
            <p className="text-xs font-bold uppercase">Block Number</p>
            <p className="text-lg font-bold">{networkInfo.blockNumber}</p>
          </div>
          <div className="bg-brutal-yellow brutal-border-sm p-3">
            <p className="text-xs font-bold uppercase">Gas Price</p>
            <p className="text-lg font-bold">{networkInfo.gasPrice} Gwei</p>
          </div>
          <div className="bg-brutal-purple text-white brutal-border-sm p-3">
            <p className="text-xs font-bold uppercase">Nonce</p>
            <p className="text-lg font-bold">{networkInfo.nonce}</p>
          </div>
        </div>
      )}

      {/* Test Actions */}
      <div className="space-y-4">
        <button
          onClick={testNetworkSwitch}
          disabled={!!testing}
          className="w-full bg-white brutal-border-sm p-4 hover:shadow-brutal transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe size={24} />
              <div className="text-left">
                <p className="font-bold uppercase">Switch Network</p>
                <p className="text-xs">Test network switching capability</p>
              </div>
            </div>
            {testing === 'switch' && <Loader2 size={20} className="animate-spin" />}
          </div>
        </button>

        <button
          onClick={testWatchAsset}
          disabled={!!testing}
          className="w-full bg-white brutal-border-sm p-4 hover:shadow-brutal transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server size={24} />
              <div className="text-left">
                <p className="font-bold uppercase">Add Token</p>
                <p className="text-xs">Test adding custom tokens</p>
              </div>
            </div>
            {testing === 'asset' && <Loader2 size={20} className="animate-spin" />}
          </div>
        </button>

        <button
          onClick={testPermissions}
          disabled={!!testing}
          className="w-full bg-white brutal-border-sm p-4 hover:shadow-brutal transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity size={24} />
              <div className="text-left">
                <p className="font-bold uppercase">Get Permissions</p>
                <p className="text-xs">Check wallet permissions</p>
              </div>
            </div>
            {testing === 'permissions' && <Loader2 size={20} className="animate-spin" />}
          </div>
        </button>
      </div>
    </div>
  );
};

export default NetworkInfo;
