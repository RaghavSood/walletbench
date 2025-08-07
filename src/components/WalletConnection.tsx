import React from 'react';
import { Wallet, Copy, CheckCircle2, ExternalLink } from 'lucide-react';

interface WalletConnectionProps {
  account: string;
  chainId: string;
  balance: string;
  onConnect: () => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({
  account,
  chainId,
  balance,
  onConnect
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getNetworkName = (chainId: string) => {
    const networks: { [key: string]: string } = {
      '1': 'Ethereum Mainnet',
      '5': 'Goerli Testnet',
      '11155111': 'Sepolia Testnet',
      '137': 'Polygon',
      '80001': 'Mumbai Testnet',
      '56': 'BSC Mainnet',
      '97': 'BSC Testnet',
      '43114': 'Avalanche',
      '43113': 'Avalanche Testnet',
    };
    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  if (!account) {
    return (
      <div className="bg-brutal-cyan brutal-border shadow-brutal-lg p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-black text-white p-4 mb-6 inline-block">
            <Wallet size={48} />
          </div>
          <h2 className="text-2xl font-bold uppercase mb-4">Connect Your Wallet</h2>
          <p className="mb-6">Connect your Web3 wallet to start testing all features</p>
          <button
            onClick={onConnect}
            className="bg-black text-white px-8 py-4 brutal-border shadow-brutal hover:shadow-brutal-xl transform hover:-translate-y-1 transition-all font-bold uppercase"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brutal-green brutal-border shadow-brutal-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Account */}
        <div className="bg-white brutal-border-sm p-4">
          <p className="text-xs font-bold uppercase mb-2">Connected Account</p>
          <div className="flex items-center gap-2">
            <code className="text-sm break-all">
              {account.slice(0, 6)}...{account.slice(-4)}
            </code>
            <button
              onClick={copyAddress}
              className="p-1 hover:bg-brutal-yellow transition-colors"
            >
              {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Network */}
        <div className="bg-white brutal-border-sm p-4">
          <p className="text-xs font-bold uppercase mb-2">Network</p>
          <p className="text-sm font-semibold">{getNetworkName(chainId)}</p>
        </div>

        {/* Balance */}
        <div className="bg-white brutal-border-sm p-4">
          <p className="text-xs font-bold uppercase mb-2">Balance</p>
          <p className="text-sm font-semibold">{parseFloat(balance).toFixed(4)} ETH</p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnection;
