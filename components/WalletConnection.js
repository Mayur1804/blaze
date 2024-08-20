import React, { useEffect } from 'react';
import { Wallet } from 'lucide-react';

const WalletConnection = ({ isConnected, onConnected, walletAddress }) => {
  const connectWallet = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        console.log('Connected with MetaMask:', accounts[0]);
        onConnected(accounts[0]);

        // Switch to Matic network
        await switchToMaticNetwork();
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert('Please install MetaMask to connect your wallet.');
      window.open('https://metamask.io/download.html', '_blank');
    }
  };

  const switchToMaticNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // 137 in hexadecimal
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x89',
              chainName: 'Matic Mainnet',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
              },
              rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
              blockExplorerUrls: ['https://polygonscan.com/']
            }],
          });
        } catch (addError) {
          console.error('Failed to add the Matic network');
        }
      }
    }
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Listen for accounts change
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          onConnected(accounts[0]);
        } else {
          onConnected(null);
        }
      });
    }
  }, [onConnected]);

  return (
    <button 
      onClick={connectWallet}
      className={`font-bold py-2 px-4 rounded-full inline-flex items-center text-sm ${
        isConnected 
          ? 'bg-green-600 hover:bg-green-700' 
          : 'bg-orange-500 hover:bg-orange-600'
      } text-white`}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnected ? truncateAddress(walletAddress) : 'Connect Wallet'}
    </button>
  );
};

export default WalletConnection;