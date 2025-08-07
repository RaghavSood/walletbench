import React, { useState } from 'react';
import { ethers } from 'ethers';
import { FileSignature, Play, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { TestResult } from '../App';

interface SignatureTestsProps {
  provider: ethers.BrowserProvider;
  account: string;
  onTestResult: (result: TestResult) => void;
}

const SignatureTests: React.FC<SignatureTestsProps> = ({
  provider,
  account,
  onTestResult
}) => {
  const [testing, setTesting] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('Hello Web3!');

  const testPersonalSign = async () => {
    setTesting('personal_sign');
    try {
      const signer = await provider.getSigner();
      const message = customMessage || 'Test message for personal_sign';
      const signature = await signer.signMessage(message);
      
      // Verify the signature
      const recoveredAddress = ethers.verifyMessage(message, signature);
      const isValid = recoveredAddress.toLowerCase() === account.toLowerCase();
      
      onTestResult({
        id: Date.now().toString(),
        category: 'signature',
        test: 'personal_sign',
        status: isValid ? 'success' : 'error',
        message: isValid ? 'Signature verified successfully' : 'Signature verification failed',
        data: { message, signature, recoveredAddress },
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'signature',
        test: 'personal_sign',
        status: 'error',
        message: error.message || 'Failed to sign message',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testTypedDataV4 = async () => {
    setTesting('eth_signTypedData_v4');
    try {
      const domain = {
        name: 'Web3 Wallet Tester',
        version: '1',
        chainId: parseInt(await provider.getNetwork().then(n => n.chainId.toString())),
        verifyingContract: '0x0000000000000000000000000000000000000000'
      };

      const types = {
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' }
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' }
        ]
      };

      const value = {
        from: {
          name: 'Alice',
          wallet: account
        },
        to: {
          name: 'Bob',
          wallet: '0x0000000000000000000000000000000000000000'
        },
        contents: 'Hello, Bob!'
      };

      const signer = await provider.getSigner();
      const signature = await signer.signTypedData(domain, types, value);
      
      // Verify the signature
      const recoveredAddress = ethers.verifyTypedData(domain, types, value, signature);
      const isValid = recoveredAddress.toLowerCase() === account.toLowerCase();
      
      onTestResult({
        id: Date.now().toString(),
        category: 'signature',
        test: 'eth_signTypedData_v4',
        status: isValid ? 'success' : 'error',
        message: isValid ? 'Typed data signature verified' : 'Typed data verification failed',
        data: { domain, types, value, signature },
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'signature',
        test: 'eth_signTypedData_v4',
        status: 'error',
        message: error.message || 'Failed to sign typed data',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const testEthSign = async () => {
    setTesting('eth_sign');
    try {
      const message = ethers.id(customMessage || 'Test message for eth_sign');
      const signature = await provider.send('eth_sign', [account, message]);
      
      onTestResult({
        id: Date.now().toString(),
        category: 'signature',
        test: 'eth_sign (Deprecated)',
        status: 'warning',
        message: 'eth_sign completed but is deprecated and unsafe',
        data: { message, signature },
        timestamp: Date.now()
      });
    } catch (error: any) {
      onTestResult({
        id: Date.now().toString(),
        category: 'signature',
        test: 'eth_sign (Deprecated)',
        status: 'error',
        message: error.message || 'Failed to execute eth_sign',
        timestamp: Date.now()
      });
    } finally {
      setTesting('');
    }
  };

  const signatureTests = [
    {
      id: 'personal_sign',
      name: 'Personal Sign',
      description: 'Standard message signing (personal_sign)',
      action: testPersonalSign,
      color: 'bg-brutal-cyan'
    },
    {
      id: 'eth_signTypedData_v4',
      name: 'Typed Data v4',
      description: 'EIP-712 structured data signing',
      action: testTypedDataV4,
      color: 'bg-brutal-green'
    },
    {
      id: 'eth_sign',
      name: 'ETH Sign (Deprecated)',
      description: 'Legacy signing method (unsafe)',
      action: testEthSign,
      color: 'bg-brutal-yellow'
    }
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-black text-white p-2">
          <FileSignature size={24} />
        </div>
        <h2 className="text-2xl font-bold uppercase">Signature Tests</h2>
      </div>

      {/* Custom Message Input */}
      <div className="mb-6">
        <label className="block text-sm font-bold uppercase mb-2">
          Custom Message
        </label>
        <input
          type="text"
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          className="w-full p-3 brutal-border-sm focus:shadow-brutal outline-none"
          placeholder="Enter message to sign..."
        />
      </div>

      {/* Test Buttons */}
      <div className="space-y-4">
        {signatureTests.map(test => (
          <div
            key={test.id}
            className={`${test.color} brutal-border-sm p-4`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold uppercase">{test.name}</h3>
                <p className="text-sm mt-1">{test.description}</p>
              </div>
              <button
                onClick={test.action}
                disabled={testing === test.id}
                className="bg-black text-white px-4 py-2 brutal-border-sm shadow-brutal-sm hover:shadow-brutal transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {testing === test.id ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Test
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-white brutal-border-sm p-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-1" />
          <div className="text-sm">
            <p className="font-bold mb-1">About Signature Tests</p>
            <p>These tests verify that your wallet correctly implements various signing methods. Signatures are verified locally to ensure they match the connected account.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureTests;
