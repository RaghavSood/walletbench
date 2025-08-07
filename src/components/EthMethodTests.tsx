import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Database, Play, Loader2, Hash, Send, Lock, Filter, Activity, DollarSign } from 'lucide-react';
import { TestResult } from '../App';

interface EthMethodTestsProps {
  provider: ethers.BrowserProvider;
  account: string;
  onTestResult: (result: TestResult) => void;
}

const EthMethodTests: React.FC<EthMethodTestsProps> = ({
  provider,
  account,
  onTestResult
}) => {
  const [testing, setTesting] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState(account); // Default to self
  const [testData, setTestData] = useState('0x');

  const testEthAccounts = async () => {
    setTesting('accounts');
    try {
      const accounts = await provider.send('eth_accounts', []);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_accounts',
        status: 'success',
        message: `Found ${accounts.length} account(s)`,
        data: accounts,
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_accounts',
        status: 'error',
        message: error.message,
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testEthRequestAccounts = async () => {
    setTesting('requestAccounts');
    try {
      const accounts = await provider.send('eth_requestAccounts', []);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_requestAccounts',
        status: 'success',
        message: `Requested ${accounts.length} account(s)`,
        data: accounts,
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_requestAccounts',
        status: 'error',
        message: error.message,
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testEthSendTransaction = async () => {
    setTesting('sendTransaction');
    try {
      // Send to self to avoid losing funds
      const tx = await provider.send('eth_sendTransaction', [{
        from: account,
        to: account,
        value: '0x1', // 1 wei
        data: '0x'
      }]);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_sendTransaction',
        status: 'success',
        message: `Transaction sent: ${tx}`,
        data: { hash: tx },
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_sendTransaction',
        status: 'error',
        message: error.message,
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testEthEstimateGas = async () => {
    setTesting('estimateGas');
    try {
      const estimate = await provider.send('eth_estimateGas', [{
        from: account,
        to: account,
        value: '0x1'
      }]);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_estimateGas',
        status: 'success',
        message: `Estimated gas: ${parseInt(estimate, 16)}`,
        data: { gasEstimate: estimate },
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_estimateGas',
        status: 'error',
        message: error.message,
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testEthCall = async () => {
    setTesting('call');
    try {
      // Call balanceOf on USDC contract for the current account
      const usdcAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
      const balanceOfData = '0x70a08231' + account.slice(2).padStart(64, '0');
      
      const result = await provider.send('eth_call', [{
        to: usdcAddress,
        data: balanceOfData
      }, 'latest']);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_call',
        status: 'success',
        message: 'Contract call successful',
        data: { result },
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_call',
        status: 'error',
        message: error.message,
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testEthGetEncryptionPublicKey = async () => {
    setTesting('encryptionKey');
    try {
      const publicKey = await provider.send('eth_getEncryptionPublicKey', [account]);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_getEncryptionPublicKey',
        status: 'success',
        message: 'Retrieved encryption public key',
        data: { publicKey },
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_getEncryptionPublicKey',
        status: 'error',
        message: error.message || 'Method may not be supported',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testEthDecrypt = async () => {
    setTesting('decrypt');
    try {
      // This would need encrypted data from eth_getEncryptionPublicKey
      const decrypted = await provider.send('eth_decrypt', [
        '0x...', // encrypted message
        account
      ]);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_decrypt',
        status: 'success',
        message: 'Decrypted message',
        data: { decrypted },
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_decrypt',
        status: 'error',
        message: error.message || 'Method requires encrypted data',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testEthSubscribe = async () => {
    setTesting('subscribe');
    try {
      const subscriptionId = await provider.send('eth_subscribe', ['newHeads']);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_subscribe',
        status: 'success',
        message: `Subscribed with ID: ${subscriptionId}`,
        data: { subscriptionId },
        timestamp: Date.now()
      });

      // Unsubscribe after 5 seconds
      setTimeout(async () => {
        try {
          await provider.send('eth_unsubscribe', [subscriptionId]);
        } catch (e) {
          console.error('Failed to unsubscribe:', e);
        }
      }, 5000);
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_subscribe',
        status: 'error',
        message: error.message || 'Subscriptions may not be supported',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testEthNewFilter = async () => {
    setTesting('newFilter');
    try {
      const filterId = await provider.send('eth_newFilter', [{
        fromBlock: 'latest',
        toBlock: 'latest',
        address: account
      }]);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_newFilter',
        status: 'success',
        message: `Created filter: ${filterId}`,
        data: { filterId },
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_newFilter',
        status: 'error',
        message: error.message,
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testEthNewBlockFilter = async () => {
    setTesting('blockFilter');
    try {
      const filterId = await provider.send('eth_newBlockFilter', []);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_newBlockFilter',
        status: 'success',
        message: `Created block filter: ${filterId}`,
        data: { filterId },
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_newBlockFilter',
        status: 'error',
        message: error.message,
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testEthNewPendingTransactionFilter = async () => {
    setTesting('pendingFilter');
    try {
      const filterId = await provider.send('eth_newPendingTransactionFilter', []);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_newPendingTransactionFilter',
        status: 'success',
        message: `Created pending tx filter: ${filterId}`,
        data: { filterId },
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_newPendingTransactionFilter',
        status: 'error',
        message: error.message,
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testEthSendRawTransaction = async () => {
    setTesting('sendRaw');
    try {
      // Create a simple transaction
      const tx = {
        to: account,
        value: ethers.parseEther('0.000001'),
        gasLimit: 21000,
        maxFeePerGas: ethers.parseUnits('20', 'gwei'),
        maxPriorityFeePerGas: ethers.parseUnits('1', 'gwei'),
        nonce: await provider.getTransactionCount(account),
        type: 2,
        chainId: 1
      };

      const signer = await provider.getSigner();
      const signedTx = await signer.signTransaction(tx);
      const txHash = await provider.send('eth_sendRawTransaction', [signedTx]);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_sendRawTransaction',
        status: 'success',
        message: `Raw transaction sent: ${txHash}`,
        data: { hash: txHash },
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'eth',
        test: 'eth_sendRawTransaction',
        status: 'error',
        message: error.message,
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const ethTests = [
    {
      id: 'accounts',
      name: 'Get Accounts',
      method: 'eth_accounts',
      description: 'Get connected accounts',
      action: testEthAccounts,
      icon: Database,
      color: 'bg-brutal-cyan'
    },
    {
      id: 'requestAccounts',
      name: 'Request Accounts',
      method: 'eth_requestAccounts',
      description: 'Request account access',
      action: testEthRequestAccounts,
      icon: Database,
      color: 'bg-brutal-green'
    },
    {
      id: 'sendTransaction',
      name: 'Send Transaction',
      method: 'eth_sendTransaction',
      description: 'Send 1 wei to self',
      action: testEthSendTransaction,
      icon: Send,
      color: 'bg-brutal-yellow'
    },
    {
      id: 'sendRaw',
      name: 'Send Raw Transaction',
      method: 'eth_sendRawTransaction',
      description: 'Send signed transaction',
      action: testEthSendRawTransaction,
      icon: Send,
      color: 'bg-brutal-purple text-white'
    },
    {
      id: 'estimateGas',
      name: 'Estimate Gas',
      method: 'eth_estimateGas',
      description: 'Estimate transaction gas',
      action: testEthEstimateGas,
      icon: DollarSign,
      color: 'bg-brutal-pink'
    },
    {
      id: 'call',
      name: 'Call Contract',
      method: 'eth_call',
      description: 'Call USDC balanceOf',
      action: testEthCall,
      icon: Hash,
      color: 'bg-brutal-cyan'
    },
    {
      id: 'encryptionKey',
      name: 'Get Encryption Key',
      method: 'eth_getEncryptionPublicKey',
      description: 'Get public encryption key',
      action: testEthGetEncryptionPublicKey,
      icon: Lock,
      color: 'bg-brutal-green'
    },
    {
      id: 'decrypt',
      name: 'Decrypt',
      method: 'eth_decrypt',
      description: 'Decrypt message',
      action: testEthDecrypt,
      icon: Lock,
      color: 'bg-brutal-yellow'
    },
    {
      id: 'subscribe',
      name: 'Subscribe',
      method: 'eth_subscribe',
      description: 'Subscribe to new blocks',
      action: testEthSubscribe,
      icon: Activity,
      color: 'bg-brutal-purple text-white'
    },
    {
      id: 'newFilter',
      name: 'New Filter',
      method: 'eth_newFilter',
      description: 'Create event filter',
      action: testEthNewFilter,
      icon: Filter,
      color: 'bg-brutal-pink'
    },
    {
      id: 'blockFilter',
      name: 'Block Filter',
      method: 'eth_newBlockFilter',
      description: 'Create block filter',
      action: testEthNewBlockFilter,
      icon: Filter,
      color: 'bg-brutal-cyan'
    },
    {
      id: 'pendingFilter',
      name: 'Pending TX Filter',
      method: 'eth_newPendingTransactionFilter',
      description: 'Create pending tx filter',
      action: testEthNewPendingTransactionFilter,
      icon: Filter,
      color: 'bg-brutal-green'
    }
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-black text-white p-2">
          <Database size={24} />
        </div>
        <h2 className="text-2xl font-bold uppercase">ETH Methods</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ethTests.map(test => {
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

export default EthMethodTests;
