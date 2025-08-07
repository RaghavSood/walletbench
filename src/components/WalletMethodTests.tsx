import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Wallet, Play, Loader2, Globe, Shield, QrCode, Phone, Settings, Eye, Lock } from 'lucide-react';
import { TestResult } from '../App';

interface WalletMethodTestsProps {
  provider: ethers.BrowserProvider;
  account: string;
  onTestResult: (result: TestResult) => void;
}

const WalletMethodTests: React.FC<WalletMethodTestsProps> = ({
  provider,
  account,
  onTestResult
}) => {
  const [testing, setTesting] = useState<string>('');

  const testAddEthereumChain = async () => {
    setTesting('addChain');
    try {
      await provider.send('wallet_addEthereumChain', [
        {
          chainId: '0x89', // Polygon
          chainName: 'Polygon Mainnet',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
          },
          rpcUrls: ['https://polygon-rpc.com'],
          blockExplorerUrls: ['https://polygonscan.com']
        }
      ]);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_addEthereumChain',
        status: 'success',
        message: 'Successfully added Polygon chain',
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_addEthereumChain',
        status: 'error',
        message: error.message || 'Failed to add chain',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testSwitchEthereumChain = async () => {
    setTesting('switchChain');
    try {
      await provider.send('wallet_switchEthereumChain', [
        { chainId: '0x1' } // Mainnet
      ]);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_switchEthereumChain',
        status: 'success',
        message: 'Successfully switched to Mainnet',
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_switchEthereumChain',
        status: 'error',
        message: error.message || 'Failed to switch chain',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testWatchAsset = async () => {
    setTesting('watchAsset');
    try {
      const wasAdded = await provider.send('wallet_watchAsset', {
        type: 'ERC20',
        options: {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC on Mainnet
          symbol: 'USDC',
          decimals: 6,
          image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
        }
      });
      
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_watchAsset',
        status: wasAdded ? 'success' : 'warning',
        message: wasAdded ? 'Asset added successfully' : 'User declined to add asset',
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_watchAsset',
        status: 'error',
        message: error.message || 'Failed to add asset',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testGetPermissions = async () => {
    setTesting('getPermissions');
    try {
      const permissions = await provider.send('wallet_getPermissions', []);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_getPermissions',
        status: 'success',
        message: `Retrieved ${permissions.length} permission(s)`,
        data: permissions,
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_getPermissions',
        status: 'error',
        message: error.message || 'Failed to get permissions',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testRequestPermissions = async () => {
    setTesting('requestPermissions');
    try {
      const permissions = await provider.send('wallet_requestPermissions', [
        { eth_accounts: {} }
      ]);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_requestPermissions',
        status: 'success',
        message: 'Permissions requested successfully',
        data: permissions,
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_requestPermissions',
        status: 'error',
        message: error.message || 'Failed to request permissions',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testRevokePermissions = async () => {
    setTesting('revokePermissions');
    try {
      await provider.send('wallet_revokePermissions', [
        { eth_accounts: {} }
      ]);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_revokePermissions',
        status: 'success',
        message: 'Permissions revoked successfully',
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_revokePermissions',
        status: 'error',
        message: error.message || 'Method may not be supported',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testGetCapabilities = async () => {
    setTesting('getCapabilities');
    try {
      const capabilities = await provider.send('wallet_getCapabilities', [account]);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_getCapabilities',
        status: 'success',
        message: 'Retrieved wallet capabilities',
        data: capabilities,
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_getCapabilities',
        status: 'error',
        message: error.message || 'Method may not be supported',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testScanQRCode = async () => {
    setTesting('scanQR');
    try {
      const result = await provider.send('wallet_scanQRCode', []);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_scanQRCode',
        status: 'success',
        message: 'QR code scanned',
        data: result,
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_scanQRCode',
        status: 'error',
        message: error.message || 'QR scanning not supported',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testRegisterOnboarding = async () => {
    setTesting('registerOnboarding');
    try {
      await provider.send('wallet_registerOnboarding', []);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_registerOnboarding',
        status: 'success',
        message: 'Onboarding registered',
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_registerOnboarding',
        status: 'error',
        message: error.message || 'Method may not be supported',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testSendCalls = async () => {
    setTesting('sendCalls');
    try {
      // Example batch call
      const calls = [
        {
          to: account,
          value: '0x0',
          data: '0x'
        }
      ];
      
      const result = await provider.send('wallet_sendCalls', [{
        version: '1.0',
        chainId: '0x1',
        from: account,
        calls
      }]);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_sendCalls',
        status: 'success',
        message: 'Batch calls sent',
        data: result,
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_sendCalls',
        status: 'error',
        message: error.message || 'Method may not be supported (EIP-5792)',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testGetCallsStatus = async () => {
    setTesting('getCallsStatus');
    try {
      // This would need a valid bundle ID from wallet_sendCalls
      const result = await provider.send('wallet_getCallsStatus', ['0x...']);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_getCallsStatus',
        status: 'success',
        message: 'Retrieved calls status',
        data: result,
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'wallet',
        test: 'wallet_getCallsStatus',
        status: 'error',
        message: error.message || 'Method may not be supported (EIP-5792)',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const walletTests = [
    {
      id: 'addChain',
      name: 'Add Chain',
      method: 'wallet_addEthereumChain',
      description: 'Add Polygon to wallet',
      action: testAddEthereumChain,
      icon: Globe,
      color: 'bg-brutal-cyan'
    },
    {
      id: 'switchChain',
      name: 'Switch Chain',
      method: 'wallet_switchEthereumChain',
      description: 'Switch to Ethereum Mainnet',
      action: testSwitchEthereumChain,
      icon: Globe,
      color: 'bg-brutal-green'
    },
    {
      id: 'watchAsset',
      name: 'Watch Asset',
      method: 'wallet_watchAsset',
      description: 'Add USDC token',
      action: testWatchAsset,
      icon: Eye,
      color: 'bg-brutal-yellow'
    },
    {
      id: 'getPermissions',
      name: 'Get Permissions',
      method: 'wallet_getPermissions',
      description: 'Get current permissions',
      action: testGetPermissions,
      icon: Shield,
      color: 'bg-brutal-purple text-white'
    },
    {
      id: 'requestPermissions',
      name: 'Request Permissions',
      method: 'wallet_requestPermissions',
      description: 'Request eth_accounts permission',
      action: testRequestPermissions,
      icon: Shield,
      color: 'bg-brutal-pink'
    },
    {
      id: 'revokePermissions',
      name: 'Revoke Permissions',
      method: 'wallet_revokePermissions',
      description: 'Revoke permissions',
      action: testRevokePermissions,
      icon: Lock,
      color: 'bg-brutal-cyan'
    },
    {
      id: 'getCapabilities',
      name: 'Get Capabilities',
      method: 'wallet_getCapabilities',
      description: 'Get wallet capabilities',
      action: testGetCapabilities,
      icon: Settings,
      color: 'bg-brutal-green'
    },
    {
      id: 'scanQR',
      name: 'Scan QR Code',
      method: 'wallet_scanQRCode',
      description: 'Scan QR code',
      action: testScanQRCode,
      icon: QrCode,
      color: 'bg-brutal-yellow'
    },
    {
      id: 'registerOnboarding',
      name: 'Register Onboarding',
      method: 'wallet_registerOnboarding',
      description: 'Register for onboarding',
      action: testRegisterOnboarding,
      icon: Phone,
      color: 'bg-brutal-purple text-white'
    },
    {
      id: 'sendCalls',
      name: 'Send Calls',
      method: 'wallet_sendCalls',
      description: 'Send batch calls (EIP-5792)',
      action: testSendCalls,
      icon: Phone,
      color: 'bg-brutal-pink'
    },
    {
      id: 'getCallsStatus',
      name: 'Get Calls Status',
      method: 'wallet_getCallsStatus',
      description: 'Get batch calls status',
      action: testGetCallsStatus,
      icon: Eye,
      color: 'bg-brutal-cyan'
    }
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-black text-white p-2">
          <Wallet size={24} />
        </div>
        <h2 className="text-2xl font-bold uppercase">Wallet Methods</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {walletTests.map(test => {
          const Icon = test.icon;
          return (
            <button
              key={test.id}
              onClick={test.action}
              disabled={!!testing}
              className={`${test.color} brutal-border-sm p-4 hover:shadow-brutal transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <div className="text-left">
                    <p className="font-bold uppercase">{test.name}</p>
                    <p className="text-xs font-mono">{test.method}</p>
                    <p className="text-xs mt-1">{test.description}</p>
                  </div>
                </div>
                {testing === test.id ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Play size={20} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WalletMethodTests;
