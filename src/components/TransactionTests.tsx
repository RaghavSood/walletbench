import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Send, Play, AlertCircle, Loader2, Zap, DollarSign, Gauge } from 'lucide-react';
import { TestResult } from '../App';

interface TransactionTestsProps {
  provider: ethers.BrowserProvider;
  account: string;
  onTestResult: (result: TestResult) => void;
}

const TransactionTests: React.FC<TransactionTestsProps> = ({
  provider,
  account,
  onTestResult
}) => {
  const [testing, setTesting] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState('0x0000000000000000000000000000000000000000');
  const [sendAmount, setSendAmount] = useState('0.0001');
  const [gasPrice, setGasPrice] = useState('');
  const [gasLimit, setGasLimit] = useState('');
  const [maxFeePerGas, setMaxFeePerGas] = useState('');
  const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState('');

  const testBasicTransaction = async () => {
    setTesting('basic_tx');
    try {
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: ethers.parseEther(sendAmount)
      });
      
      onTestResult({
        id: Date.now().toString(),
        category: 'transaction',
        test: 'Basic Transaction',
        status: 'success',
        message: `Transaction sent: ${tx.hash}`,
        data: { hash: tx.hash, to: tx.to, value: sendAmount },
        timestamp: Date.now()
      });

      // Wait for confirmation
      const receipt = await tx.wait();
      onTestResult({
        id: Date.now().toString() + '_confirm',
        category: 'transaction',
        test: 'Transaction Confirmation',
        status: receipt?.status === 1 ? 'success' : 'error',
        message: `Transaction ${receipt?.status === 1 ? 'confirmed' : 'failed'} in block ${receipt?.blockNumber}`,
        data: receipt,
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'transaction',
        test: 'Basic Transaction',
        status: 'error',
        message: error.message || 'Transaction failed',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testLegacyGasTransaction = async () => {
    setTesting('legacy_gas');
    try {
      const signer = await provider.getSigner();
      const txRequest: any = {
        to: recipientAddress,
        value: ethers.parseEther(sendAmount),
        type: 0 // Legacy transaction
      };

      if (gasPrice) {
        txRequest.gasPrice = ethers.parseUnits(gasPrice, 'gwei');
      }
      if (gasLimit) {
        txRequest.gasLimit = BigInt(gasLimit);
      }

      const tx = await signer.sendTransaction(txRequest);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'transaction',
        test: 'Legacy Gas Transaction',
        status: 'success',
        message: `Legacy transaction sent: ${tx.hash}`,
        data: { 
          hash: tx.hash, 
          gasPrice: gasPrice || 'auto',
          gasLimit: gasLimit || 'auto'
        },
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'transaction',
        test: 'Legacy Gas Transaction',
        status: 'error',
        message: error.message || 'Legacy transaction failed',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testEIP1559Transaction = async () => {
    setTesting('eip1559');
    try {
      const signer = await provider.getSigner();
      const txRequest: any = {
        to: recipientAddress,
        value: ethers.parseEther(sendAmount),
        type: 2 // EIP-1559 transaction
      };

      if (maxFeePerGas) {
        txRequest.maxFeePerGas = ethers.parseUnits(maxFeePerGas, 'gwei');
      }
      if (maxPriorityFeePerGas) {
        txRequest.maxPriorityFeePerGas = ethers.parseUnits(maxPriorityFeePerGas, 'gwei');
      }
      if (gasLimit) {
        txRequest.gasLimit = BigInt(gasLimit);
      }

      const tx = await signer.sendTransaction(txRequest);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'transaction',
        test: 'EIP-1559 Transaction',
        status: 'success',
        message: `EIP-1559 transaction sent: ${tx.hash}`,
        data: { 
          hash: tx.hash,
          maxFeePerGas: maxFeePerGas || 'auto',
          maxPriorityFeePerGas: maxPriorityFeePerGas || 'auto'
        },
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'transaction',
        test: 'EIP-1559 Transaction',
        status: 'error',
        message: error.message || 'EIP-1559 transaction failed',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testContractInteraction = async () => {
    setTesting('contract');
    try {
      // ERC-20 transfer function signature
      const iface = new ethers.Interface([
        'function transfer(address to, uint256 amount)'
      ]);
      
      const data = iface.encodeFunctionData('transfer', [
        recipientAddress,
        ethers.parseUnits('1', 18)
      ]);

      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC on mainnet (example)
        data: data,
        gasLimit: 100000n
      });
      
      onTestResult({
        id: Date.now().toString(),
        category: 'transaction',
        test: 'Contract Interaction',
        status: 'success',
        message: `Contract call sent: ${tx.hash}`,
        data: { hash: tx.hash, data: data.slice(0, 10) + '...' },
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'transaction',
        test: 'Contract Interaction',
        status: 'error',
        message: error.message || 'Contract interaction failed',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-black text-white p-2">
          <Send size={24} />
        </div>
        <h2 className="text-2xl font-bold uppercase">Transaction Tests</h2>
      </div>

      {/* Transaction Parameters */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-bold uppercase mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="w-full p-3 brutal-border-sm focus:shadow-brutal outline-none font-mono text-sm"
            placeholder="0x..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold uppercase mb-2">
            Amount (ETH)
          </label>
          <input
            type="text"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            className="w-full p-3 brutal-border-sm focus:shadow-brutal outline-none"
            placeholder="0.0001"
          />
        </div>

        {/* Gas Settings */}
        <div className="bg-brutal-yellow brutal-border-sm p-4">
          <h3 className="font-bold uppercase mb-3 flex items-center gap-2">
            <Gauge size={20} />
            Gas Settings (Optional)
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">
                Gas Limit
              </label>
              <input
                type="text"
                value={gasLimit}
                onChange={(e) => setGasLimit(e.target.value)}
                className="w-full p-2 brutal-border-sm bg-white focus:shadow-brutal-sm outline-none text-sm"
                placeholder="Auto"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase mb-1">
                Gas Price (Gwei)
              </label>
              <input
                type="text"
                value={gasPrice}
                onChange={(e) => setGasPrice(e.target.value)}
                className="w-full p-2 brutal-border-sm bg-white focus:shadow-brutal-sm outline-none text-sm"
                placeholder="Auto"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase mb-1">
                Max Fee (Gwei)
              </label>
              <input
                type="text"
                value={maxFeePerGas}
                onChange={(e) => setMaxFeePerGas(e.target.value)}
                className="w-full p-2 brutal-border-sm bg-white focus:shadow-brutal-sm outline-none text-sm"
                placeholder="Auto"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase mb-1">
                Priority Fee (Gwei)
              </label>
              <input
                type="text"
                value={maxPriorityFeePerGas}
                onChange={(e) => setMaxPriorityFeePerGas(e.target.value)}
                className="w-full p-2 brutal-border-sm bg-white focus:shadow-brutal-sm outline-none text-sm"
                placeholder="Auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={testBasicTransaction}
          disabled={!!testing}
          className="bg-brutal-cyan brutal-border-sm p-4 hover:shadow-brutal transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="font-bold uppercase">Basic Transaction</p>
              <p className="text-xs mt-1">Standard ETH transfer</p>
            </div>
            {testing === 'basic_tx' ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Play size={20} />
            )}
          </div>
        </button>

        <button
          onClick={testLegacyGasTransaction}
          disabled={!!testing}
          className="bg-brutal-green brutal-border-sm p-4 hover:shadow-brutal transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="font-bold uppercase">Legacy Gas</p>
              <p className="text-xs mt-1">Type 0 transaction</p>
            </div>
            {testing === 'legacy_gas' ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <DollarSign size={20} />
            )}
          </div>
        </button>

        <button
          onClick={testEIP1559Transaction}
          disabled={!!testing}
          className="bg-brutal-purple text-white brutal-border-sm p-4 hover:shadow-brutal transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="font-bold uppercase">EIP-1559</p>
              <p className="text-xs mt-1">Type 2 transaction</p>
            </div>
            {testing === 'eip1559' ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Zap size={20} />
            )}
          </div>
        </button>

        <button
          onClick={testContractInteraction}
          disabled={!!testing}
          className="bg-brutal-pink brutal-border-sm p-4 hover:shadow-brutal transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="font-bold uppercase">Contract Call</p>
              <p className="text-xs mt-1">Smart contract interaction</p>
            </div>
            {testing === 'contract' ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </div>
        </button>
      </div>

      {/* Warning */}
      <div className="mt-6 bg-white brutal-border-sm p-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-1 text-brutal-pink" />
          <div className="text-sm">
            <p className="font-bold mb-1">Test Network Only!</p>
            <p>These tests will send real transactions. Only use test networks with test ETH. Never test on mainnet with real funds.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTests;
