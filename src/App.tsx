import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Wallet,
  Shield,
  FileSignature,
  Send,
  Hash,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Copy,
  ExternalLink,
  Zap,
  Database,
  Network,
  Key,
  FileText,
  Settings,
  Activity,
  Globe,
  Eye
} from 'lucide-react';
import WalletConnection from './components/WalletConnection';
import SignatureTests from './components/SignatureTests';
import TransactionTests from './components/TransactionTests';
import WalletMethodTests from './components/WalletMethodTests';
import EthMethodTests from './components/EthMethodTests';
import ReadOnlyTests from './components/ReadOnlyTests';
import TestResults from './components/TestResults';
import NetworkInfo from './components/NetworkInfo';

export interface TestResult {
  id: string;
  category: string;
  test: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  data?: any;
  timestamp: number;
}

function App() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>('');
  const [chainId, setChainId] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [activeTab, setActiveTab] = useState<'wallet' | 'eth' | 'signatures' | 'transactions' | 'readonly' | 'network'>('wallet');

  useEffect(() => {
    checkWalletConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();

        if (accounts.length > 0) {
          setProvider(provider);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          const network = await provider.getNetwork();
          setChainId(network.chainId.toString());

          const balance = await provider.getBalance(address);
          setBalance(ethers.formatEther(balance));
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount('');
      setProvider(null);
      setBalance('');
    } else {
      checkWalletConnection();
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        setProvider(provider);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const network = await provider.getNetwork();
        setChainId(network.chainId.toString());

        const balance = await provider.getBalance(address);
        setBalance(ethers.formatEther(balance));

        addTestResult({
          id: Date.now().toString(),
          category: 'connection',
          test: 'Wallet Connection',
          status: 'success',
          message: `Connected to ${address}`,
          timestamp: Date.now()
        });
      } catch (error: any) {
        addTestResult({
          id: Date.now().toString(),
          category: 'connection',
          test: 'Wallet Connection',
          status: 'error',
          message: error.message || 'Failed to connect wallet',
          timestamp: Date.now()
        });
      }
    } else {
      addTestResult({
        id: Date.now().toString(),
        category: 'connection',
        test: 'Wallet Detection',
        status: 'error',
        message: 'No Web3 wallet detected. Please install MetaMask or another Web3 wallet.',
        timestamp: Date.now()
      });
    }
  };

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [result, ...prev]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const tabs = [
    { id: 'wallet', label: 'WALLET', icon: Wallet },
    { id: 'eth', label: 'ETH', icon: Database },
    { id: 'signatures', label: 'SIGNATURES', icon: FileSignature },
    { id: 'transactions', label: 'TRANSACTIONS', icon: Send },
    { id: 'readonly', label: 'READ-ONLY', icon: Eye },
    { id: 'network', label: 'NETWORK', icon: Network },
  ];

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="bg-brutal-pink brutal-border shadow-brutal-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-brutal-cyan brutal-border-sm p-2 flex items-center justify-center" style={{ width: '64px', height: '64px' }}>
                <img src="/logo.svg" alt="WalletBench Logo" className="w-full h-full" />
              </div>
              <div>
                <h1 className="text-4xl font-bold uppercase">WALLETBENCH</h1>
                <p className="text-sm mt-1 uppercase tracking-wider">Web3 Wallet Extension Testing Suite</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-brutal-yellow brutal-border-sm px-3 py-1">
                <span className="text-xs font-bold">MAINNET</span>
              </div>
              <div className="bg-brutal-green brutal-border-sm px-3 py-1">
                <span className="text-xs font-bold">v2.0.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-brutal-cyan brutal-border shadow-brutal p-4 mb-6">
          <div className="flex items-start gap-3">
            <Zap className="flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="font-bold uppercase">Comprehensive Testing Suite</p>
              <p className="text-sm mt-1">Tests all wallet and eth JSON-RPC methods. Safe token transfers return to sender.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Wallet Connection */}
      <WalletConnection
        account={account}
        chainId={chainId}
        balance={balance}
        onConnect={connectWallet}
      />

      {/* Main Content */}
      {account && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Test Controls */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      px-4 py-3 brutal-border font-bold uppercase flex items-center gap-2
                      transition-all transform hover:-translate-y-1
                      ${isActive
                        ? 'bg-black text-white shadow-brutal-lg'
                        : 'bg-white hover:bg-brutal-cyan shadow-brutal'
                      }
                    `}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="bg-white brutal-border shadow-brutal-lg p-6">
              {activeTab === 'wallet' && (
                <WalletMethodTests
                  provider={provider!}
                  account={account}
                  onTestResult={addTestResult}
                />
              )}
              {activeTab === 'eth' && (
                <EthMethodTests
                  provider={provider!}
                  account={account}
                  onTestResult={addTestResult}
                />
              )}
              {activeTab === 'signatures' && (
                <SignatureTests
                  provider={provider!}
                  account={account}
                  onTestResult={addTestResult}
                />
              )}
              {activeTab === 'transactions' && (
                <TransactionTests
                  provider={provider!}
                  account={account}
                  onTestResult={addTestResult}
                />
              )}
              {activeTab === 'readonly' && (
                <ReadOnlyTests
                  provider={provider!}
                  account={account}
                  onTestResult={addTestResult}
                />
              )}
              {activeTab === 'network' && (
                <NetworkInfo
                  provider={provider!}
                  account={account}
                  onTestResult={addTestResult}
                />
              )}
            </div>
          </div>

          {/* Test Results */}
          <div className="lg:col-span-1">
            <TestResults
              results={testResults}
              onClear={clearResults}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t-4 border-black">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <p className="text-sm font-bold uppercase">
            Complete JSON-RPC Testing Suite for Web3 Wallets
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com/RaghavSood/walletbench"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-4 py-2 brutal-border-sm shadow-brutal-sm hover:shadow-brutal transition-all"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
